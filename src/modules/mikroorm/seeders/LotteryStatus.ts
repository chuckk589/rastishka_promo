import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { LotteryStatus, LotteryState } from '../entities/LotteryStatus';
import { Translation } from '../entities/Translation';

export class LotteryStatusSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const pending = await em.findOneOrFail(Translation, { name: 'LOTTERY_PENDING' });
    const ended = await em.findOneOrFail(Translation, { name: 'LOTTERY_ENDED' });
    em.create(LotteryStatus, { name: LotteryState.PENDING, translation: pending });
    em.create(LotteryStatus, { name: LotteryState.ENDED, translation: ended });
  }
}
