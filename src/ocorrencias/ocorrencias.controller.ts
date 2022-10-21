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

  @Post()
  create(@Body() payload: CreateOcorrenciaDto) {
    return this.service.create(payload);
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
  update(@Body() payload: CreateOcorrenciaDto, @Param('id') id: string) {
    return this.service.update(payload, +id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
