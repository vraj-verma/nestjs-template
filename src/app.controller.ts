import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('api/status')
export class AppController {

  @Get()
  getHello(): string {
    return `Service Up & Running...!`
  }
}
