import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Check } from './Check';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Lottery } from './Lottery';

@Entity()
export class Winner extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ default: false })
  primary!: boolean;

  @Property({ default: false })
  confirmed!: boolean;

  @Property({ default: false })
  notified!: boolean;

  @ManyToOne(() => Lottery)
  lottery!: Lottery;

  @ManyToOne(() => Check)
  check!: Check;

  // @ManyToOne(() => PrizeValue)
  // prize_value!: PrizeValue;
}
