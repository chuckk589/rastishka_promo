import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PrizeValueService } from './prize-value.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RetrievePrizeValueDto } from './dto/retrieve-prize-value.dto';
import { CreatePrizeValueDto } from './dto/create-prize-value.dto';

@Controller({
  path: 'prize-value',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class PrizeValueController {
  constructor(private readonly prizeValueService: PrizeValueService) {}

  @Get()
  findAll() {
    return this.prizeValueService.findAll();
  }
  @Post()
  async create(@Body() createPrizeValueDto: CreatePrizeValueDto): Promise<RetrievePrizeValueDto> {
    return await this.prizeValueService.create(createPrizeValueDto);
  }

  @Delete()
  bulkRemove(@Query('ids') ids: string) {
    return this.prizeValueService.bulkRemove(ids.split(',').map((id) => parseInt(id, 10)));
  }
}
