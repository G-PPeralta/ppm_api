import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoProjetoService } from './tipo-projeto.service';
import { CreateTipoProjetoDto } from './dto/create-tipo-projeto.dto';
import { UpdateTipoProjetoDto } from './dto/update-tipo-projeto.dto';

@Controller('tipo-projeto')
export class TipoProjetoController {
  constructor(private readonly tipoProjetoService: TipoProjetoService) {}

  @Post()
  create(@Body() createTipoProjetoDto: CreateTipoProjetoDto) {
    return this.tipoProjetoService.create(createTipoProjetoDto);
  }

  @Get()
  findAll() {
    return this.tipoProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoProjetoDto: UpdateTipoProjetoDto) {
    return this.tipoProjetoService.update(+id, updateTipoProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProjetoService.remove(+id);
  }
}
