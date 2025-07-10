import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Utility } from '../utils/utils';

@Module({
  controllers: [UsersController],
  providers: [Utility],
})
export class UsersModule { }
