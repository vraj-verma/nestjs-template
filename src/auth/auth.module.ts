import { Module } from '@nestjs/common';
import { Utility } from '../utils/utils';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    Utility,
  ],
})
export class AuthModule { }
