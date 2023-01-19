/**
 * CRIADO EM: 07/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Endpoints que criam, listam, atualizam e removem um projeto.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { VincularAtividade } from './dto/vincular-atividade.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Get('detalhados')
  async getProjetosDetalhados() {
    return await this.projetosService.getProjetosDetalhados();
  }

  @Get('curva-s')
  async buscarDadosCurvaSGeral() {
    return await this.projetosService.buscarDadosCurvaSGeral();
  }

  @Get('previstoXRealizado')
  async previstoXRealizadoGeral() {
    return await this.projetosService.previstoXRealizadoGeral();
  }

  @Get('/prazos/find')
  async findAllProjetosPrazos() {
    return this.projetosService.findAllProjetosPrazos();
  }

  @Get('/previsXRealizadoProjeto/:id')
  async revistoXRealizadoGeralPorProjeto(@Param('id') id: string) {
    return this.projetosService.previstoXRealizadoGeralPorProjeto(+id);
  }

  @Get('/prazos/find/:id')
  async findProjetosPrazos(@Param('id') id: string) {
    return this.projetosService.findProjetosPrazos(+id);
  }

  @Get('/percentuais/:id')
  async findProjetosPercentuais(@Param('id') id: string) {
    return this.projetosService.findProjetosPercentuais(+id);
  }

  @Get('/filtroProjeto/:nomProjeto')
  async filtroProjeto(@Param('nomProjeto') nomProjeto: string) {
    if (!isNaN(Number(nomProjeto))) {
      return this.projetosService.filtroProjetos(nomProjeto);
    } else {
      return this.projetosService.filtroProjetos('');
    }
  }

  @Post('/registro')
  async create(@Body() payload: CreateProjetoDto) {
    try {
      const novoProjeto = await this.projetosService.create(payload);
      return novoProjeto;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('relacoes/:id')
  async relacoes(@Param('id') id: string) {
    return this.projetosService.verificarRelacoes(+id);
  }

  @Get('relacoesexecucao/:id')
  async relacoesexec(@Param('id') id: string) {
    return this.projetosService.verificarRelacoesExecucao(+id);
  }

  @Get('configuracoes/:id')
  async projetoConfig(@Param('id') id: string) {
    return this.projetosService.projetoConfig(+id);
  }

  @Post('vincular')
  async vincular(@Body() vincularAtividade: VincularAtividade) {
    return this.projetosService.vincularAtividade(vincularAtividade);
  }

  @Get('chaves')
  async findChaves() {
    return this.projetosService.findChaves();
  }

  @Get('listagem')
  async findAll() {
    try {
      return this.projetosService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/count-all-projects')
  async countAll() {
    try {
      const count = await this.projetosService.countAll();
      return count;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/find-total-value/:id')
  async findTotalValue(@Param('id') id: string) {
    try {
      const totalValue = await this.projetosService.findTotalValue(+id);
      return totalValue;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    try {
      const project = this.projetosService.findOne(+id);
      return project;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetosService.update(+id, updateProjetoDto);
  }

  @Patch('/descJust/:id')
  updateDescricaoJustificativa(
    @Param('id') id: string,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetosService.updateDescricaoJustificativa(
      +id,
      updateProjetoDto,
    );
  }

  @Delete(':id/:user')
  async remove(@Param('id') id: string, @Param('user') user: string) {
    return await this.projetosService.remove(+id, user);
  }

  @Get('/gerar/ids')
  async gerarIds() {
    return await this.projetosService.gerarIds();
  }
}
