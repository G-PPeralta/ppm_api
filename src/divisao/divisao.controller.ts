/**
 *  CRIADO EM: 02/08/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a divisão
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
import { DivisaoService } from './divisao.service';
import { CreateDivisaoDto } from './dto/create-divisao.dto';

@UseGuards(JwtAuthGuard)
@Controller('divisao')
export class DivisaoController {
  constructor(private readonly divisaoService: DivisaoService) {}

  @Post()
  create(@Body() createDivisaoDto: CreateDivisaoDto) {
    return this.divisaoService.create(createDivisaoDto);
  }

  @Get()
  findAll() {
    try {
      return this.divisaoService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
