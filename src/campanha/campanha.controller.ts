import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampanhaService } from './campanha.service';
import { CampanhaFiltro } from './dto/campanha-filtro.dto';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { CreateCampanhaFilhoDto } from './dto/create-filho.dto';
import { ReplanejarCampanhaDto } from './dto/replanejar-campanha.dto';
import { TrocarPocoSondaDto } from './dto/trocar-poco-sonda.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@UseGuards(JwtAuthGuard)
@Controller('campanha')
export class CampanhaController {
  constructor(private readonly campanhaService: CampanhaService) {}

  @Post('/pai')
  createPai(@Body() createCampanhaDto: CreateCampanhaDto) {
    return this.campanhaService.createPai(createCampanhaDto);
  }

  @Post('/filho')
  createFilho(@Body() createCampanhaDto: CreateCampanhaFilhoDto) {
    return this.campanhaService.createFilho(createCampanhaDto);
  }

  @Post('/filho/atividade')
  createAtividade(
    @Body() createAtividadeCampanhaDto: CreateAtividadeCampanhaDto,
  ) {
    return this.campanhaService.createAtividade(createAtividadeCampanhaDto);
  }

  @Post()
  findAll(@Body() campanhaFiltro: CampanhaFiltro) {
    return this.campanhaService.findAll(campanhaFiltro);
  }

  @Post('gantt')
  findAllGantt(@Body() campanhaFiltro: CampanhaFiltro) {
    return this.campanhaService.findAllGantt(campanhaFiltro);
  }

  @Get('precedentes')
  visaoPrecedentes() {
    return this.campanhaService.visaoPrecedentes();
  }

  @Get('find')
  findCampanhas() {
    return this.campanhaService.findCampanha();
  }

  @Get('find/datas/:id')
  findDatas(@Param('id') id: string) {
    return this.campanhaService.findDatas(+id);
  }

  @Get('/datainicioexecucao/:id')
  findDataInicioExecucao(@Param('id') id: string) {
    return this.campanhaService.findDataInicial(+id);
  }

  @Get('/datainicioexecucao/estatistica/:id')
  findDataInicioExecucaoEstatistica(@Param('id') id: string) {
    return this.campanhaService.findDataInicialEstatistica(+id);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.campanhaService.findOne(+id);
  }

  @Patch()
  updatePayload(@Body() payload: UpdateCampanhaDto) {
    return this.campanhaService.updatePayload(payload);
  }

  @Post('replanejar/:id')
  replanejarCampanha(
    @Body() payload: ReplanejarCampanhaDto[],
    @Param('id') id_campanha: string,
  ) {
    return this.campanhaService.replanejar(payload, +id_campanha);
  }

  @Post('replanejar')
  trocarSondapoco(@Body() payload: TrocarPocoSondaDto) {
    return this.campanhaService.trocarPocoSonda(payload);
  }

  @Get('datas/:id')
  dataFinalCampanha(@Param('id') idCampanha: string) {
    return this.campanhaService.dataFinalCampanha(+idCampanha);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.campanhaService.update(+id, campo, valor);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.campanhaService.remove(+id, user);
  }
}
