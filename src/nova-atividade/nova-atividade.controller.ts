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

  @Post('intervencao/:id')
  vinculaIntervencao(
    @Param('id') id: string,
    @Body() createAtividade: CreateAtividade,
  ) {
    const retorno = this.novaAtividadeService.create(createAtividade);
    return this.novaAtividadeService.vinculaIntervencao(
      +id,
      retorno[0].id,
      createAtividade,
    );
  }
}
