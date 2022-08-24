import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Promo } from '../entities/Promo';
import { Translation } from '../entities/Translation';

export class PromoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const promo_1 = await em.findOneOrFail(Translation, { name: 'PROMO_1' });
    const promo_2 = await em.findOneOrFail(Translation, { name: 'PROMO_2' });
    const promo_3 = await em.findOneOrFail(Translation, { name: 'PROMO_3' });
    const promo_4 = await em.findOneOrFail(Translation, { name: 'PROMO_4' });
    em.create(Promo, { name: 'PROMO_1', translation: promo_1 });
    em.create(Promo, { name: 'PROMO_2', translation: promo_2 });
    em.create(Promo, { name: 'PROMO_3', translation: promo_3 });
    em.create(Promo, { name: 'PROMO_4', translation: promo_4 });
  }
}
