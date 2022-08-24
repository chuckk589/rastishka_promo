import { Module } from '@nestjs/common';
import { PrizeValueService } from './prize-value.service';
import { PrizeValueController } from './prize-value.controller';

@Module({
  controllers: [PrizeValueController],
  providers: [PrizeValueService]
})
export class PrizeValueModule {}
