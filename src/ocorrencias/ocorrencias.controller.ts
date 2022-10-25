import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';

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

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
