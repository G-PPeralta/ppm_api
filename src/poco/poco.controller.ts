/**
 *  CRIADO EM: 16/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a pocos.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PocoService } from './poco.service';
import { CreatePocoDto } from './dto/create-poco.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('poco')
export class PocoController {
  constructor(private readonly pocoService: PocoService) {}

  @Post()
  create(@Body() createPocoDto: CreatePocoDto) {
    return this.pocoService.create(createPocoDto);
  }

  @Get()
  findAll() {
    return this.pocoService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pocoService.remove(+id);
  }
}
