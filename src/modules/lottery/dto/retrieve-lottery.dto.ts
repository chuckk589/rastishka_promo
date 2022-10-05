import { Lottery } from 'src/modules/mikroorm/entities/Lottery';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { Winner } from 'src/modules/mikroorm/entities/Winner';

export class RetrieveLotteryDto {
  constructor(lottery: Lottery) {
    this.id = lottery.id.toString();
    this.start = lottery.start;
    this.end = lottery.end;
    // this.status = lottery.status.translation.getLocalizedLabel(Locale.RU);
    // this.prize = lottery.prize.translation.getLocalizedLabel(Locale.RU);
    this.status = lottery.status?.id.toString() || '';
    this.prize = lottery.prize?.id.toString() || '';
    // this.primaryWinners = lottery.primaryWinners;
    // this.reserveWinners = lottery.reserveWinners;
    this.createdAt = lottery.createdAt;
    this.winners = lottery.winners.getItems().map((winner) => new RetrieveWinnerDto(winner));
  }
  id: string;
  start: Date;
  end: Date;
  status: string;
  prize: string;
  primaryWinners: number;
  reserveWinners: number;
  createdAt: Date;
  winners: RetrieveWinnerDto[];
}
export class RetrieveWinnerDto {
  constructor(winner: Winner) {
    this.id = winner.id.toString();
    this.confirmed = winner.confirmed;
    this.notified = winner.notified;
    this.fancyId = winner.check.fancyId;
    this.credentials = winner.check?.user?.credentials || '';
    this.phone = winner.check?.user?.phone || '';
    this.checkPath = winner.check?.path || '';
    this.primary = winner.primary;
    this.city = winner.check?.user?.city?.id.toString() || '';
    // this.prize = winner.prize_value?.qr_payload || '';
    // this.prizeId = winner.prize_value?.id || null;
  }
  id: string;
  confirmed: boolean;
  notified: boolean;
  primary: boolean;
  fancyId: string;
  credentials: string;
  phone: string;
  checkPath: string;
  prize: string;
  city: string;
  prizeId: number;
}
