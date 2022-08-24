import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CheckStatus } from '../mikroorm/entities/CheckStatus';
import { LotteryStatus } from '../mikroorm/entities/LotteryStatus';
import { Prize } from '../mikroorm/entities/Prize';
import { Promo } from '../mikroorm/entities/Promo';
import { Locale, UserRole } from '../mikroorm/entities/User';
import { RetrieveStatusDto } from './dto/retrieve-status.dto';
import fs from 'fs';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import i18n from '../bot/middleware/i18n';
import { City } from '../mikroorm/entities/City';

@Injectable()
export class StatusService {
  constructor(private readonly em: EntityManager) {}
  updateLocales(updateLocaleDto: UpdateLocaleDto) {
    const existingLocale = updateLocaleDto.ru ? 'ru' : 'uz';
    fs.writeFileSync(
      `./dist/modules/bot/locales/${existingLocale}.json`,
      JSON.stringify(updateLocaleDto[existingLocale]),
    );
    i18n.loadLocale(existingLocale, updateLocaleDto[existingLocale]);
  }
  async findLocales(): Promise<{ [key: string]: { [key: string]: string } }> {
    return {
      ru: JSON.parse(fs.readFileSync('./dist/modules/bot/locales/ru.json', 'utf8')),
      uz: JSON.parse(fs.readFileSync('./dist/modules/bot/locales/uz.json', 'utf8')),
    };
  }
  async findAll(): Promise<Record<string, RetrieveStatusDto[]>> {
    const promos = await this.em.find(Promo, {}, { populate: ['translation.values'] });
    const check_s = await this.em.find(CheckStatus, {}, { populate: ['translation.values', 'comment.values'] });
    const cities = await this.em.find(City, {}, { populate: ['translation.values'] });
    const lottery_s = await this.em.find(LotteryStatus, {}, { populate: ['translation.values'] });
    const prizes = await this.em.find(Prize, {}, { populate: ['translation.values'] });
    return {
      cities: cities.map((city) => new RetrieveStatusDto(city)),
      promotions: promos.map((promo) => new RetrieveStatusDto(promo)),
      check_statuses: check_s.map((check_s) => new RetrieveStatusDto(check_s)),
      lottery_statuses: lottery_s.map((lottery_s) => new RetrieveStatusDto(lottery_s)),
      locales: Object.values(Locale).map(
        (locale) => new RetrieveStatusDto({ value: locale, label: locale == 'ru' ? 'Русский' : 'Узбекский' }),
      ),
      roles: Object.values(UserRole).map(
        (role) => new RetrieveStatusDto({ value: role, label: role == 'user' ? 'Пользователь' : 'Администратор' }),
      ),
      prizes: prizes.map((prize) => new RetrieveStatusDto(prize)),
    };
  }
}
