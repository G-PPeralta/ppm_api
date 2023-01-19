/**
 *  CRIADO EM: 2/10/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a local
 */

import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  create(@Body() createLocalDto: CreateLocalDto) {
    return this.localService.create(createLocalDto);
  }

  @Get()
  findAll() {
    try {
      return this.localService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
