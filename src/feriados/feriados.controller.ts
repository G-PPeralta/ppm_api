import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Feriado } from './dto/feriado.dto';
import { FeriadosService } from './feriados.service';

@UseGuards(JwtAuthGuard)
@Controller('feriados')
export class FeriadosController {
  constructor(private readonly service: FeriadosService) {}

  @Get('range')
  getFeriadosTratados() {
    return this.service.getFeriadosTratados();
  }

  @Get('range/one/:id')
  getOneFeriadosTratados(@Param('id') id: string) {
    return this.service.getOneFeriadosTratados(+id);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get('one/:id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Delete(':id/:nom_usu_erase')
  remove(
    @Param('id') id: string,
    @Param('nom_usu_erase') nom_usu_erase: string,
  ) {
    return this.service.remove(+id, nom_usu_erase);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: Feriado) {
    return this.service.update(payload, +id);
  }

  @Post()
  create(@Body() payload: Feriado) {
    return this.service.create(payload);
  }
}
