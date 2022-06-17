import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { TarefaService } from 'tarefa/tarefa.service';
import { CreateTarefaDto } from 'tarefa/dto/create-tarefa.dto';

@Controller('tarefa')
export class TarefaController {
  constructor(private readonly tarefaService: TarefaService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createTarefaDto: CreateTarefaDto) {
    return this.tarefaService.create(createTarefaDto);
  }

  @Get()
  async findAll() {
    const tarefas = await this.tarefaService.findAll();
    return tarefas;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarefaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.tarefaService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarefaService.remove(+id);
  }
}
