import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrioridadeService } from './prioridade.service';
import { CreatePrioridadeDto } from './dto/create-prioridade.dto';
import { UpdatePrioridadeDto } from './dto/update-prioridade.dto';

@Controller('prioridade')
export class PrioridadeController {
  constructor(private readonly prioridadeService: PrioridadeService) {}

  @Post()
  create(@Body() createPrioridadeDto: CreatePrioridadeDto) {
    return this.prioridadeService.create(createPrioridadeDto);
  }

  @Get()
  findAll() {
    return this.prioridadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prioridadeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrioridadeDto: UpdatePrioridadeDto) {
    return this.prioridadeService.update(+id, updatePrioridadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prioridadeService.remove(+id);
  }
}
