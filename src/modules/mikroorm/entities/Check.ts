import {
  BeforeCreate,
  Collection,
  Entity,
  EventArgs,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CheckState, CheckStatus } from './CheckStatus';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Winner } from './Winner';

@Entity()
export class Check extends CustomBaseEntity {
  constructor(check?: Partial<Check>) {
    super();
    Object.assign(this, check);
  }
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  fancyId: string = Math.random().toString(36).substr(2, 11).toUpperCase();

  @Property({ length: 255 })
  path!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => CheckStatus)
  status!: CheckStatus;

  @OneToMany(() => Winner, (winner) => winner.check)
  winners = new Collection<Winner>(this);

  @BeforeCreate()
  async beforeCreate(args: EventArgs<Check>): Promise<void> {
    if (!this.status) {
      this.status = await args.em.findOne(CheckStatus, { name: CheckState.MODERATED });
    }
  }
}
