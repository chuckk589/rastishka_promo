import { EntityManager, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Check } from '../mikroorm/entities/Check';
import { Lottery } from '../mikroorm/entities/Lottery';
import { LotteryStatus } from '../mikroorm/entities/LotteryStatus';
import { Prize } from '../mikroorm/entities/Prize';
import { Winner } from '../mikroorm/entities/Winner';
import { CreateWinnerDto } from '../winner/dto/create-winner.dto';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { RetrieveLotteryDto, RetrieveWinnerDto } from './dto/retrieve-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';

@Injectable()
export class LotteryService {
  constructor(private readonly em: EntityManager) {}
  async addWinner(createWinnerDto: CreateWinnerDto, id: number) {
    const check = await this.em.findOne(Check, { fancyId: createWinnerDto.fancyId });
    if (!check) {
      throw new HttpException(`Чек с номером ${createWinnerDto.fancyId} не найден`, HttpStatus.BAD_REQUEST);
    }
    const lottery = await this.em.findOne(Lottery, id, { populate: ['prize', 'winners.check'] });
    const newWinner = this.em.create(Winner, {
      // primary: createWinnerDto.primary,
      check: check,
    });
    // if (createWinnerDto.primary === true) {
    //   const avaivablePrizes = await this.em.find(
    //     PrizeValue,
    //     { winners: { $eq: null }, prize: lottery.prize },
    //     { populate: ['winners', 'prize'] },
    //   );
    //   if (!avaivablePrizes.length) {
    //     throw new HttpException('Нет доступных призов для призера', HttpStatus.BAD_REQUEST);
    //   }
    //   newWinner.prize_value = avaivablePrizes[0];
    // } else if (createWinnerDto.primary === false) {
    //   if (!createWinnerDto.sharesWith) {
    //     throw new HttpException(
    //       'Для запасного победителя требуется указывать на чей приз он претендует',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    //   const sharedWinner = lottery.winners.toArray().find((winner) => winner.id === +createWinnerDto.sharesWith);
    //   if (!sharedWinner) {
    //     throw new HttpException('Этого никогда не должно было произойти', HttpStatus.BAD_REQUEST);
    //   }
    //   newWinner.prize_value = this.em.getReference(PrizeValue, sharedWinner.prize_value.id);
    // }
    lottery.winners.add(newWinner);
    await this.em.persistAndFlush(lottery);
    // await wrap(newWinner).init(true, ['check.user', 'prize_value']);
    await wrap(lottery).init(true, ['status.translation.values', 'prize.translation.values', 'winners.check.user']);
    return new RetrieveLotteryDto(lottery);
  }
  async create(createLotteryDto: CreateLotteryDto): Promise<RetrieveLotteryDto> {
    //should be at least equal
    // if (createLotteryDto.primaryWinners < createLotteryDto.reserveWinners) {
    //   throw new HttpException(
    //     `Number of primaryWinners should bot be less than reserveWiners , \nPrimary: ${Number(
    //       createLotteryDto.primaryWinners,
    //     )}, \nReserve: ${createLotteryDto.reserveWinners}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    // const requestedPrize = await this.em.findOne(Prize, { id: Number(createLotteryDto.prize) });
    // const where = {
    //   ...(requestedPrize.name == 'PRIZE_WEEKLY'
    //     ? {
    //         createdAt: {
    //           $gte: createLotteryDto.start,
    //           $lt: createLotteryDto.end,
    //         },
    //         winners: { $eq: null },
    //       }
    //     : {}),
    // };
    // const checks = await this.em.find(
    //   Check,
    //   {
    //     ...where,
    //     status: { name: CheckState.APPROVED },
    //   },
    //   { populate: ['winners'] },
    // );
    // const avaivablePrizes = await this.em.find(
    //   PrizeValue,
    //   { winners: { $eq: null }, prize: requestedPrize },
    //   { populate: ['winners', 'prize'] },
    // );

    // if (avaivablePrizes.length < Number(createLotteryDto.primaryWinners)) {
    //   throw new HttpException(
    //     `Not enough prizes of requested type ${requestedPrize.name}, \nRequested ${Number(
    //       createLotteryDto.primaryWinners,
    //     )}, \nAvailable: ${avaivablePrizes.length}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // const totalWinners = Number(createLotteryDto.primaryWinners) + Number(createLotteryDto.reserveWinners);
    // if (checks.length < totalWinners) {
    //   throw new HttpException(
    //     `Not enough checks, \nRequested ${totalWinners}, \nAvailable: ${checks.length}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    // const winners = getRandomArrayValues(checks, totalWinners);
    const lottery = this.em.create(Lottery, {
      // primaryWinners: Number(createLotteryDto.primaryWinners),
      // reserveWinners: Number(createLotteryDto.reserveWinners),
      prize: this.em.getReference(Prize, Number(createLotteryDto.prize)),
      end: createLotteryDto.end,
      start: createLotteryDto.start,
      // winners: winners.map((winner, index) =>
      //   this.em.create(Winner, {
      //     check: this.em.getReference(Check, winner.id),
      //     primary: index < Number(createLotteryDto.primaryWinners),
      //     prize_value: avaivablePrizes[index % Number(createLotteryDto.primaryWinners)],
      //   }),
      // ),
    });
    await this.em.persistAndFlush(lottery);
    await wrap(lottery).init(true, ['status', 'prize']);
    return new RetrieveLotteryDto(lottery);
  }

  async findAll(): Promise<RetrieveLotteryDto[]> {
    return (
      await this.em.find(
        Lottery,
        {},
        {
          populate: ['status.translation.values', 'prize.translation.values', 'winners.check.user.city'],
        },
      )
    ).map((lottery) => new RetrieveLotteryDto(lottery));
  }

  async update(id: number, updateLotteryDto: UpdateLotteryDto) {
    const lottery = await this.em.findOne(Lottery, id);
    lottery.status = this.em.getReference(LotteryStatus, Number(updateLotteryDto.status));
    lottery.start = updateLotteryDto.start;
    lottery.end = updateLotteryDto.end;
    await this.em.persistAndFlush(lottery);
    await wrap(lottery).init(true, ['winners.check.user.city']);
    return new RetrieveLotteryDto(lottery);
  }

  async remove(id: number) {
    const lottery = await this.em.find(Lottery, { id }, { populate: ['winners'] });
    await this.em.removeAndFlush(lottery);
  }
}
