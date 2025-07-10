import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { Utility } from '../utils/utils';

@Module({
  controllers: [AccountsController],
  providers: [Utility],
})
export class AccountsModule { }
