import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckService } from './check.service';
import { UpdateCheckDto } from './dto/update-check.dto';

@Controller({
  path: 'check',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  findAll() {
    return this.checkService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    return this.checkService.update(+id, updateCheckDto);
  }
}
