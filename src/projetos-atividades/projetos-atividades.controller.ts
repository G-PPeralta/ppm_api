import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateProjetosAtividadeDto } from './dto/create-projetos-atividades.dto';
import { CreateProjetosFilhoDto } from './dto/create-projetos-filho.dto';
import { UpdateProfundidadeDTO } from './dto/update-profundidade.dto';
import { ProjetosAtividadesService } from './projetos-atividades.service';

@UseGuards(JwtAuthGuard)
@Controller('projetos-atividades')
export class ProjetosAtividadesController {
  constructor(
    private readonly projetosAtividadesService: ProjetosAtividadesService,
  ) {}

  @Post()
  create(@Body() createProjetosAtividadesDto: CreateProjetosAtividadeDto) {
    return this.projetosAtividadesService.create(createProjetosAtividadesDto);
  }

  @Post('vincular')
  createFilho(@Body() payload: CreateProjetosFilhoDto) {
    return this.projetosAtividadesService.createFilho(payload);
  }

  @Get('find/operacoes')
  findOperacoes() {
    return this.projetosAtividadesService.findOperacoes();
  }

  @Get()
  findAll() {
    return this.projetosAtividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetosAtividadesService.findOne(+id);
  }

  @Get('/pendencia/:idprojeto')
  async getAtividaesProjetos(@Param('idprojeto') idprojeto: string) {
    return await this.projetosAtividadesService.getAtividaesProjetos(idprojeto);
  }

  @Get('/curva-s/:idprojeto')
  async getCurvaS(@Param('idprojeto') idprojeto: string) {
    return await this.projetosAtividadesService.getCurvaS(idprojeto);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.projetosAtividadesService.update(+id, campo, valor);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.projetosAtividadesService.remove(+id, user);
  }

  @Get('/finddatafinalpredecessor/:id')
  async getDataFinalPredecessor(@Param('id') id: string) {
    return await this.projetosAtividadesService.findDataFinalPredecessor(+id);
  }

  @Post('/updateProfundidade')
  async updateProfundiade(@Body() payload: UpdateProfundidadeDTO) {
    return await this.projetosAtividadesService.updateProfundidade(
      +payload.id_pai,
      payload.profundidade,
    );
  }

  @Get('/getProfundidade/:id')
  async getProfundidade(@Param('id') id: string) {
    return this.projetosAtividadesService.getProfundidadeById(+id);
  }
}
