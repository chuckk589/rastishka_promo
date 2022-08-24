import { PrizeValue } from 'src/modules/mikroorm/entities/PrizeValue.dep';

export class RetrievePrizeValueDto {
  constructor(prize: PrizeValue) {
    this.id = prize.id;
    this.qr_payload = prize.qr_payload;
    this.prizeId = prize.prize.id;
  }
  id: number;
  qr_payload: string;
  prizeId: number;
}
