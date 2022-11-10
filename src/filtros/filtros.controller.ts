import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltroDto } from './dto/filtros.dto';
import { FiltrosService } from './filtros.service';

@Controller('filtros')
export class FiltrosController {
  constructor(private readonly service: FiltrosService) {}

  @Post()
  async findMedia(@Body() filtro: FiltroDto) {
    return await this.service.findMedia(filtro);
  }
  @Post('duracao')
  async getMediaDuracao(@Body() filtro: FiltroDto) {
    return await this.service.getMediaDuracao(filtro);
  }

  @Get('datas/:id_poco')
  findDataIni(@Param('id_poco') id: string) {
    return this.service.findProxData(+id);
  }

  @Get('operacao/:nome')
  findDuracaoMediaByName(@Param('nome') nome: string) {
    return this.service.findDuracaoMedia(nome);
  }

  @Get('sondas')
  findSondas() {
    return this.service.findSondas();
  }

  @Get('pocos')
  findPocos() {
    return this.service.findPocos();
  }

  @Get('media-hora/:id')
  async mediaHoraById(@Param('id') id: string) {
    return await this.service.MediaHoraById(id);
  }

  @Get('metodos')
  findMetodos() {
    return this.service.findMetodos();
  }
}
