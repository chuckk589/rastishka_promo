import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountComposer } from './account.composer';

@Module({
  providers: [AccountService, AccountComposer],
  exports: [AccountComposer],
})
export class AccountModule {}
