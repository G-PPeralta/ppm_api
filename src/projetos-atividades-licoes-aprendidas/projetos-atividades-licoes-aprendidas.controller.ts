/**
 * CRIADO EM: 18/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Endpoints que criam, listam, atualizam e removem lições aprendidas das atividades de um projeto.
 */

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
import { CreateProjetosAtividadesLicoesAprendidasDto } from './dto/projetos-atividades-licoes-aprendidas.dto';
import { ProjetosAtividadesLicoesAprendidasService } from './projetos-atividades-licoes-aprendidas.service';

@UseGuards(JwtAuthGuard)
@Controller('projetos-atividades-licoes-aprendidas')
export class ProjetosAtividadesLicoesAprendidasController {
  constructor(
    private readonly projetosAtividadesLicoesAprendidasService: ProjetosAtividadesLicoesAprendidasService,
  ) {}

  @Post()
  create(
    @Body()
    createProjetosAtividadeDto: CreateProjetosAtividadesLicoesAprendidasDto,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.create(
      createProjetosAtividadeDto,
    );
  }

  @Get()
  findAll() {
    return this.projetosAtividadesLicoesAprendidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetosAtividadesLicoesAprendidasService.findOne(+id);
  }

  @Get(':id_do_projeto/:id_da_licao')
  findOneLicao(
    @Param('id_do_projeto') id_do_projeto: string,
    @Param('id_da_licao') id_da_licao: string,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.findOneLicao(
      +id_do_projeto,
      +id_da_licao,
    );
  }

  @Patch(':id/:campo/:valor/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.update(
      +id,
      campo,
      valor,
      user,
    );
  }

  @Patch(':id_do_projeto/:id_da_licao')
  updateOne(
    @Param('id_do_projeto') id_do_projeto: string,
    @Param('id_da_licao') id_da_licao: string,
    @Body() payload: CreateProjetosAtividadesLicoesAprendidasDto,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.updateOne(
      +id_do_projeto,
      +id_da_licao,
      payload,
    );
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.projetosAtividadesLicoesAprendidasService.remove(+id, user);
  }
}
