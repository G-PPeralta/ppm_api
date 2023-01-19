/**
 * CRIADO EM: 02/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE CRIAÇÃO, LISTAGEM, ATUALIZAÇÃO E REMOÇÃO DE SONDA
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SondaService } from './sonda.service';
import { CreateSondaDto } from './dto/create-sonda.dto';
import { UpdateSondaDto } from './dto/update-sonda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sonda')
export class SondaController {
  constructor(private readonly sondaService: SondaService) {}

  @Post()
  create(@Body() createSondaDto: CreateSondaDto) {
    return this.sondaService.create(createSondaDto);
  }

  @Get()
  findAll() {
    return this.sondaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sondaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSondaDto: UpdateSondaDto) {
    return this.sondaService.update(+id, updateSondaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sondaService.remove(+id);
  }
}
