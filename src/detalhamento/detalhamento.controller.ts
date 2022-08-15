import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalhamentoService } from './detalhamento.service';
import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Controller('detalhamento')
export class DetalhamentoController {
  constructor(private readonly detalhamentoService: DetalhamentoService) {}

  @Post()
  create(@Body() createDetalhamentoDto: CreateDetalhamentoDto) {
    return this.detalhamentoService.create(createDetalhamentoDto);
  }

  @Get()
  findAll() {
    return this.detalhamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalhamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalhamentoDto: UpdateDetalhamentoDto) {
    return this.detalhamentoService.update(+id, updateDetalhamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalhamentoService.remove(+id);
  }
}
