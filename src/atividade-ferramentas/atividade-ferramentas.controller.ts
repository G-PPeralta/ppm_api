/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados de para ferramentas utilizadas em atividades
 */
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AtividadeFerramentasService } from './atividade-ferramentas.service';
import { CreateAtividadeFerramentaDto } from './dto/create-atividade-ferramenta.dto';

@UseGuards(JwtAuthGuard)
@Controller('atividade-ferramentas')
export class AtividadeFerramentasController {
  constructor(
    private readonly atividadeFerramentasService: AtividadeFerramentasService,
  ) {}

  @Post()
  async create(
    @Body() createAtividadeFerramentaDto: CreateAtividadeFerramentaDto,
  ) {
    return await this.atividadeFerramentasService.create(
      createAtividadeFerramentaDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadeFerramentasService.findById(+id);
  }
}
