import { Controller, Get } from '@nestjs/common';
import { LixeiraService } from './lixeira.service';

@Controller('lixeira')
export class LixeiraController {
  constructor(private readonly service: LixeiraService) {}

  @Get()
  getLixeira() {
    return this.service.getLixeira();
  }
}
