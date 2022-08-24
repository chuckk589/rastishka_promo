import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Translation } from '../entities/Translation';

export class TranslationSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Translation, { name: 'CITY_1' });
    em.create(Translation, { name: 'CITY_2' });
    em.create(Translation, { name: 'CITY_3' });
    em.create(Translation, { name: 'CITY_4' });
    em.create(Translation, { name: 'CITY_5' });
    em.create(Translation, { name: 'CITY_6' });
    em.create(Translation, { name: 'CITY_7' });
    em.create(Translation, { name: 'CITY_8' });
    em.create(Translation, { name: 'CITY_9' });
    em.create(Translation, { name: 'LOTTERY_ENDED' });
    em.create(Translation, { name: 'LOTTERY_PENDING' });
    em.create(Translation, { name: 'PRIZE_MAIN' });
    em.create(Translation, { name: 'PRIZE_WEEKLY' });
    em.create(Translation, { name: 'PROMO_1' });
    em.create(Translation, { name: 'PROMO_2' });
    em.create(Translation, { name: 'PROMO_3' });
    em.create(Translation, { name: 'PROMO_4' });
    em.create(Translation, { name: 'REJECT_REASON_1' });
    em.create(Translation, { name: 'REJECT_REASON_2' });
    em.create(Translation, { name: 'REJECT_REASON_3' });
    em.create(Translation, { name: 'REJECT_REASON_4' });
    em.create(Translation, { name: 'REJECT_REASON_5' });
    em.create(Translation, { name: 'STATUS_APPROVED' });
    em.create(Translation, { name: 'STATUS_MODERATED' });
    em.create(Translation, { name: 'STATUS_REJECTED' });
  }
}
