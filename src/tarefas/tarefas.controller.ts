import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTarefas } from './dto/create-tarefas.dto';
import { TarefasService } from './tarefas.service';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get()
  findAll() {
    return this.tarefasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarefasService.findOne(+id);
  }

  @Get('/projeto/:id')
  findByProjeto(@Param('id') id: string) {
    return this.tarefasService.findByProjeto(+id);
  }

  @Post()
  create(@Body() createTarefas: CreateTarefas) {
    return this.tarefasService.create(createTarefas);
  }

  @Patch(':id/:campo/:valor/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.tarefasService.update(+id, campo, valor, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tarefasService.delete(+id);
  }
}
