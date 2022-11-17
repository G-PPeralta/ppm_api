import { Controller, Get } from '@nestjs/common';
import { AreaResponsavelService } from './area_responsavel.service';

@Controller('area-responsavel')
export class AreaResponsavelController {
  constructor(private service: AreaResponsavelService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
