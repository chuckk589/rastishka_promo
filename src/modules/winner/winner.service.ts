import { EntityManager } from '@mikro-orm/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BotContext } from 'src/types/interfaces';
import i18n from '../bot/middleware/i18n';
import { Winner } from '../mikroorm/entities/Winner';
import { UpdateWinnerDto } from './dto/update-winner.dto';
import { RetrieveWinnerDto } from '../lottery/dto/retrieve-lottery.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class WinnerService {
  constructor(
    private readonly em: EntityManager,
    @Inject(BOT_NAME) private bot: Bot<BotContext>,
    @InjectPinoLogger('WinnerService') private readonly logger: PinoLogger,
  ) {}
  async remove(id: number) {
    return await this.em.nativeDelete(Winner, { id });
  }
  async sendNotification(id: number) {
    const winner = await this.em.findOneOrFail(Winner, { id }, { populate: ['check.user', 'lottery.prize'] });
    const message = i18n.t(winner.check.user.locale, 'PRIZE_WEEKLY', { check_id: winner.check.fancyId });
    await this.bot.api.sendMessage(winner.check.user.chatId, message).then(() => {
      this.logger.info(`Notification sent to userId: ${winner.check.user.id} checkId: ${winner.check.fancyId} `);
    });
  }
  async update(id: number, updateWinnerDto: UpdateWinnerDto) {
    const winner = await this.em.findOne(Winner, id, { populate: ['check.user'] });
    // if (!winner.primary && updateWinnerDto.primary === true) {
    //   //check if theres another winner with the same prize_value
    //   const samePrizeWinner = await this.em.findOne(Winner, {
    //     prize_value: winner.prize_value,
    //     primary: true,
    //   });
    //   if (samePrizeWinner) {
    //     throw new HttpException(
    //       'Данному победителю нельзя выставить статус основной\n - на этот приз уже существует претендент с таким же статусом',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }
    if (!winner.notified && updateWinnerDto.notified === true) {
      await this.sendNotification(id).catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    }
    // if (!winner.confirmed && updateWinnerDto.confirmed === true) {
    //   await this.sendQRCode(id).catch((err) => {
    //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    //   });
    // }
    winner.confirmed = updateWinnerDto.confirmed;
    winner.notified = updateWinnerDto.notified;
    // winner.primary = updateWinnerDto.primary;
    await this.em.persistAndFlush(winner);
    return new RetrieveWinnerDto(winner);
  }
  // async sendQRCode(id: number) {
  //   const winner = await this.em.findOneOrFail(
  //     Winner,
  //     { id },
  //     { populate: ['check.user', 'lottery.prize', 'prize_value'] },
  //   );
  //   const message = i18n.t(winner.check.user.locale, 'PRIZE_WEEKLY_QR', { check_id: winner.check.fancyId });
  //   const barCode = await QRCode.toBuffer(winner.prize_value.qr_payload, {
  //     scale: 15,
  //   });
  //   if (winner.lottery.prize.name !== 'PRIZE_MAIN') {
  //     await this.bot.api
  //       .sendPhoto(winner.check.user.chatId, new InputFile(barCode), {
  //         caption: message,
  //       })
  //       .then(() => {
  //         this.logger.info(
  //           `Sent QR code to userId: ${winner.check.user.id} checkId: ${winner.check.fancyId} qr_payload: ${winner.prize_value.qr_payload}`,
  //         );
  //       });
  //   } else {
  //     await this.bot.api.sendMessage(winner.check.user.chatId, message).then(() => {
  //       this.logger.info(
  //         `Sent QR code to userId: ${winner.check.user.id} checkId: ${winner.check.fancyId} qr_payload: ${winner.prize_value.qr_payload}`,
  //       );
  //     });
  //   }
  // }
}
