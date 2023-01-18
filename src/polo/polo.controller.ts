/**
 *  CRIADO EM: 02/08/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controller informações pertinestes a polo
 */

import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PoloService } from './polo.service';
import { CreatePoloDto } from './dto/create-polo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('polo')
export class PoloController {
  constructor(private readonly poloService: PoloService) {}

  @Post()
  create(@Body() createPoloDto: CreatePoloDto) {
    return this.poloService.create(createPoloDto);
  }

  @Get()
  findAll() {
    try {
      return this.poloService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
