import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { HistoricoEstatisticoDto } from './dto/historico-estatistico.dto';
import { HistoricoEstatisticoService } from './historico-estatistico.service';

@UseGuards(JwtAuthGuard)
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
