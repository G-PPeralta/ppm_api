import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { HistoricoEstatisticoDto } from './dto/historico-estatistico.dto';
import { HistoricoEstatisticoService } from './historico-estatistico.service';

@Controller('historico-estatistico')
export class HistoricoEstatisticoController {
  constructor(private readonly service: HistoricoEstatisticoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() payload: HistoricoEstatisticoDto) {
    return this.service.create(payload);
  }

  @Patch()
  update(@Body() payload: HistoricoEstatisticoDto) {
    return this.service.update(payload);
  }
}
