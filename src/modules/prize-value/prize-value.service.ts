import { EntityManager } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePrizeValueDto } from './dto/create-prize-value.dto';
import { RetrievePrizeValueDto } from './dto/retrieve-prize-value.dto';

@Injectable()
export class PrizeValueService {
  constructor(private readonly em: EntityManager) {}
  async create(createPrizeValueDto: CreatePrizeValueDto): Promise<RetrievePrizeValueDto> {
    const prize = this.em.create(PrizeValue, {
      qr_payload: createPrizeValueDto.qr_payload,
      prize: this.em.getReference(PrizeValue, +createPrizeValueDto.prizeId),
    });
    await this.em.persistAndFlush(prize);
    return new RetrievePrizeValueDto(prize);
  }
  async bulkRemove(ids: number[]) {
    const prizeValues = await this.em.find(PrizeValue, { id: { $in: ids } }, { populate: ['winners'] });
    const withWinners = prizeValues.filter((value) => value.winners.length > 0);
    if (withWinners.length > 0) {
      throw new HttpException(
        `Некоторые из запрошенных для удаления призовых значений\n имеют ассоциированных победителей и не могут быть удалены`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.em.removeAndFlush(prizeValues);
    }
  }
  async findAll(): Promise<RetrievePrizeValueDto[]> {
    const values = await this.em.find(PrizeValue, {}, { populate: ['prize.translation.values'] });
    return values.map((value) => new RetrievePrizeValueDto(value));
  }

  async remove(id: number) {
    const prizeValue = await this.em.findOne(PrizeValue, { id }, { populate: ['winners'] });
    if (prizeValue.winners.length === 0) {
      await this.em.removeAndFlush(prizeValue);
    } else {
      throw new HttpException(
        `PrizeValue with id ${id} has ${prizeValue.winners.length} assosiated winners and can't be removed`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
