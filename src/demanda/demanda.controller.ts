/**
 * CRIADO EM: 31/07/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados de demanda
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DemandaService } from './demanda.service';

@UseGuards(JwtAuthGuard)
@Controller('demanda')
export class DemandaController {
  constructor(private readonly demandaService: DemandaService) {}

  @Get()
  findAll() {
    return this.demandaService.findAll();
  }
}
