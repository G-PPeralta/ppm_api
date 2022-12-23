import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';

@UseGuards(JwtAuthGuard)
@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly service: OcorrenciasService) {}

  @Post(':id')
  create(@Body() payload: CreateOcorrenciaDto, @Param('id') id: string) {
    return this.service.create(payload, +id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
