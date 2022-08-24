import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { CheckStatus, CheckState } from '../entities/CheckStatus';
import { Translation } from '../entities/Translation';

export class CheckStatusSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const moderated = await em.findOneOrFail(Translation, { name: 'STATUS_MODERATED' });
    const rejected = await em.findOneOrFail(Translation, { name: 'STATUS_REJECTED' });
    const rejected_1 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_1' });
    const rejected_2 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_2' });
    const rejected_3 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_3' });
    const rejected_4 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_4' });
    const rejected_5 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_5' });
    const approved = await em.findOneOrFail(Translation, { name: 'STATUS_APPROVED' });
    em.create(CheckStatus, { name: CheckState.MODERATED, translation: moderated });
    em.create(CheckStatus, { name: CheckState.REJECTED, comment: rejected_1, translation: rejected });
    em.create(CheckStatus, { name: CheckState.REJECTED, comment: rejected_2, translation: rejected });
    em.create(CheckStatus, { name: CheckState.REJECTED, comment: rejected_3, translation: rejected });
    em.create(CheckStatus, { name: CheckState.REJECTED, comment: rejected_4, translation: rejected });
    em.create(CheckStatus, { name: CheckState.REJECTED, comment: rejected_5, translation: rejected });
    em.create(CheckStatus, { name: CheckState.APPROVED, translation: approved });
  }
}
