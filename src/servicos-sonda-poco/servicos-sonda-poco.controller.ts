/**
 * CRIADO EM: 04/10/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE RELAÇÃO DE POÇOS E SONDAS
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ServicosSondaPocoService } from './servicos-sonda-poco.service';

@UseGuards(JwtAuthGuard)
@Controller('servicos-sonda-poco')
export class ServicosSondaPocoController {
  constructor(private readonly service: ServicosSondaPocoService) {}

  @Get('sondas')
  getSondas() {
    return this.service.findSondas();
  }

  @Get('pocos/:id')
  getPocos(@Param('id') id_projeto: string) {
    return this.service.findPocos(+id_projeto);
  }

  @Get('datas/:id')
  getIntervalo(@Param('id') id_poco: string) {
    return this.service.findDatas(+id_poco);
  }

  @Get(':id_template/:dat_inicio/:dat_minima_execucao')
  verificaErroCronograma(
    @Param('id_template') id_template: number,
    @Param('dat_inicio') dat_inicio: string,
    @Param('dat_minima_execucao') dat_minima_execucao: string,
  ) {
    return this.service.verificaErrosCronograma(
      id_template,
      dat_inicio,
      dat_minima_execucao,
    );
  }
}
