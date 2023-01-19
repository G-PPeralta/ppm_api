/**
 * CRIADO EM: 16/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a classe de serviço
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ClasseServicoService } from './classe-servico.service';

@UseGuards(JwtAuthGuard)
@Controller('classe-servico')
export class ClasseServicoController {
  constructor(private readonly service: ClasseServicoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
