/**
 * CRIADO EM: 16/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a centro de custo
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CentroCustoService } from './centro-custo.service';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';

@Controller('centro-custo')
export class CentroCustoController {
  constructor(private readonly service: CentroCustoService) {}

  @Post(':id')
  create(@Body() create: CreateCentroCustoDto, @Param('id') id: string) {
    return this.service.create(create, +id);
  }

  @Get('datas/:id')
  getRange(@Param('id') id: string) {
    return this.service.getRange(+id);
  }

  @Patch(':id')
  update(@Body() update: CreateCentroCustoDto, @Param('id') id: string) {
    return this.service.update(update, +id);
  }

  @Delete(':id_custo/:nome_usuario')
  delete(
    @Param('id_custo') id_custo: string,
    @Param('nome_usuario') nome_usuario: string,
  ) {
    return this.service.delete(+id_custo, nome_usuario);
  }
}
