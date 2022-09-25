import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAtividade } from './dto/create-atividade.dto';
import { NovaAtividadeService } from './nova-atividade.service';

@Controller('nova-atividade')
export class NovaAtividadeController {
  constructor(private readonly novaAtividadeService: NovaAtividadeService) {}

  @Get('tarefas')
  findTarefas() {
    return this.novaAtividadeService.findTarefas();
  }

  @Post()
  create(@Body() createAtividade: CreateAtividade) {
    return this.novaAtividadeService.create(createAtividade);
  }
}
