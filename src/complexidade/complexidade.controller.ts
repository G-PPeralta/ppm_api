/**
 * CRIADO EM: 31/07/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a complexidade dos projetos
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComplexidadeService } from './complexidade.service';

@UseGuards(JwtAuthGuard)
@Controller('complexidade')
export class ComplexidadeController {
  constructor(private readonly complexidadeService: ComplexidadeService) {}

  @Get()
  findAll() {
    return this.complexidadeService.findAll();
  }
}
