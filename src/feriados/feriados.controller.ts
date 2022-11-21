import { Controller, Get } from '@nestjs/common';
import { FeriadosService } from './feriados.service';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly service: FeriadosService) {}

  @Get('range')
  getFeriadosTratados() {
    return this.service.getFeriadosTratados();
  }
}
