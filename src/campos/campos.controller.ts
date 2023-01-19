/**
 * CRIADO EM: 09/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado aos campos
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CamposService } from './campos.service';

@UseGuards(JwtAuthGuard)
@Controller('campos')
export class CamposController {
  constructor(private readonly camposService: CamposService) {}

  @Get()
  findAll() {
    return this.camposService.findAll();
  }
}
