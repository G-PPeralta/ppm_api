/**
 * CRIADO EM: 18/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados de atividades executadas
 */
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AtividadeServicosService } from './atividade-servicos.service';
import { CreateAtividadeServicoDto } from './dto/create-atividade-servico.dto';

@UseGuards(JwtAuthGuard)
@Controller('atividade-servicos')
export class AtividadeServicosController {
  constructor(
    private readonly atividadeServicosService: AtividadeServicosService,
  ) {}

  @Post()
  async create(@Body() createAtividadeServicoDto: CreateAtividadeServicoDto) {
    return await this.atividadeServicosService.create(
      createAtividadeServicoDto,
    );
  }

  @Get()
  async findAll() {
    return await this.atividadeServicosService.findAll();
  }
}
