import { Module } from '@nestjs/common';
import { globalComposer } from './global.composer';
import { globalService } from './global.service';

@Module({
  imports: [],
  providers: [globalService, globalComposer],
  exports: [globalComposer],
})
export class globalModule {}
