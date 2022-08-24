import { EntityManager } from '@mikro-orm/mysql';
import { Inject, Injectable } from '@nestjs/common';
import e from 'express';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BotContext } from 'src/types/interfaces';
import i18n from '../bot/middleware/i18n';
import { Check } from '../mikroorm/entities/Check';
import { CheckState, CheckStatus } from '../mikroorm/entities/CheckStatus';
import { User } from '../mikroorm/entities/User';
import { RetrieveCheckDto } from './dto/retrieve-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@Injectable()
export class CheckService {
  constructor(private readonly em: EntityManager, @Inject(BOT_NAME) private bot: Bot<BotContext>) {}

  async findAll(): Promise<RetrieveCheckDto[]> {
    return (
      await this.em.find(Check, {}, { populate: ['user', 'status.translation.values', 'status.comment.values'] })
    ).map((check) => new RetrieveCheckDto(check));
  }

  async update(id: number, updateCheckDto: UpdateCheckDto) {
    const user = await this.em.findOneOrFail(User, { checks: { id } }, { populate: ['checks', 'checks.status'] });
    const check = user.checks.getItems().find((check) => check.id === id);
    const approvedAmmount = user.checks.getItems().filter((check) => check.status.name === CheckState.APPROVED).length;
    const check_status = await this.em.findOneOrFail(
      CheckStatus,
      { id: Number(updateCheckDto.status) },
      { populate: ['comment', 'translation'] },
    );
    let message: string;
    if (check_status.name == CheckState.REJECTED) {
      message = i18n.t(check.user.locale, check_status.comment.name, { check_id: check.fancyId });
    } else if (check_status.name == CheckState.APPROVED) {
      message = i18n.t(check.user.locale, approvedAmmount === 0 ? 'STATUS_APPROVED_1' : 'STATUS_APPROVED_2', {
        check_id: check.fancyId,
      });
    }
    if (message) {
      this.bot.api.sendMessage(check.user.chatId, message, { parse_mode: 'HTML' }).catch((er) => {});
    }
    check.status = check_status;
    await this.em.persistAndFlush(check);
    return new RetrieveCheckDto(check);
  }
}
