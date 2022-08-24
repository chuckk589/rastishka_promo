import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Config } from '../entities/Config';
import { CheckStatusSeeder } from './CheckStatus';
import { CitySeeder } from './City';
import { LotteryStatusSeeder } from './LotteryStatus';
import { PrizeSeeder } from './Prize';
import { PromoSeeder } from './Promo';
import { TranslationSeeder } from './Translation';
import { TranslationValueSeeder } from './TranslationValue';

export class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Config, {
      name: 'ADMIN_PASSCODE',
      value: '$2a$12$rok.MCu02SSWKkSuTRhwdudPl4N6QQl0sRRBf1vyTaxLiw14TwR6i',
    });
    em.create(Config, {
      name: 'BOT_TOKEN_PROD',
      value: '1863509702:AAHj4bH--KGvJwl8oguY0Rj4Uo7bHsAiUNg',
    });
    return this.call(em, [
      TranslationSeeder,
      TranslationValueSeeder,
      CheckStatusSeeder,
      PrizeSeeder,
      LotteryStatusSeeder,
      PromoSeeder,
      CitySeeder,
    ]);
  }
}
