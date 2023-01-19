/**
 * CRIADO EM: 27/07/2022
 * AUTOR: PEDRO FRANCA
 * DESCRIÇÃO: Listagem de prioridades.
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrioridadeService } from './prioridade.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('prioridade')
export class PrioridadeController {
  constructor(private readonly prioridadeService: PrioridadeService) {}

  @Get()
  findAll() {
    return this.prioridadeService.findAll();
  }
}
