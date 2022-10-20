import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
// import { CreateResponsavelDto } from 'responsavel/dto/create-responsavel.dto';
// import { prismaClient } from 'index.prisma';
import { ResponsavelService } from '../responsavel/responsavel.service';
import { VincularAtividade } from './dto/vincular-atividade.dto';

@Controller('projetos')
export class ProjetosController {
  constructor(
    private readonly projetosService: ProjetosService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  @Get('detalhados')
  async getProjetosDetalhados() {
    return await this.projetosService.getProjetosDetalhados();
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

  @Post('vincular')
  async vincular(@Body() vincularAtividade: VincularAtividade) {
    return this.projetosService.vincularAtividade(vincularAtividade);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetosService.remove(+id);
  }
}
