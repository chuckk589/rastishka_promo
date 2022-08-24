import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Prize } from '../entities/Prize';
import { Translation } from '../entities/Translation';

export class PrizeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const weekly = await em.findOneOrFail(Translation, { name: 'PRIZE_WEEKLY' });
    const main = await em.findOneOrFail(Translation, { name: 'PRIZE_MAIN' });
    em.create(Prize, { name: 'PRIZE_WEEKLY', translation: weekly });
    em.create(Prize, { name: 'PRIZE_MAIN', translation: main });
  }
}
