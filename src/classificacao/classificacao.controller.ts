/**
 * CRIADO EM: 31/07/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a classificação de projetos
 */
import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClassificacaoService } from './classificacao.service';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';

@UseGuards(JwtAuthGuard)
@Controller('classificacao')
export class ClassificacaoController {
  constructor(private readonly classificacaoService: ClassificacaoService) {}

  @Post()
  create(@Body() createClassificacaoDto: CreateClassificacaoDto) {
    return this.classificacaoService.create(createClassificacaoDto);
  }

  @Get()
  findAll() {
    try {
      return this.classificacaoService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
