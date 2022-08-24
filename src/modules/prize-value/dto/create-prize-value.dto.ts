import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreatePrizeValueDto {
  @IsString()
  @IsNotEmpty()
  qr_payload!: string;
  @IsNumberString()
  @IsNotEmpty()
  prizeId: string;
}
