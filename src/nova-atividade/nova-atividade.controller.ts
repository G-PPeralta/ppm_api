import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('vincular/:id')
  createEVincular(
    @Param('id') id: string,
    @Body() createAtividade: CreateAtividade,
  ) {
    return null;
  }
}
