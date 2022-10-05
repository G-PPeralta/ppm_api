import { Controller, Get, Param } from '@nestjs/common';
import { ServicosSondaPocoService } from './servicos-sonda-poco.service';

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
}
