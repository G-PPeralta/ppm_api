import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAtividade } from './dto/create-atividade.dto';
import { CreateAtividadeOutro } from './dto/create-outros.dto';
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

  @Post('outros')
  createOutros(@Body() createOutros: CreateAtividadeOutro) {
    return this.novaAtividadeService.createOutros(createOutros);
  }

  @Post('intervencao/:id')
  async vinculaIntervencao(
    @Param('id') id: string,
    @Body() createAtividade: CreateAtividade,
  ) {
    //const retorno = await this.novaAtividadeService.create(createAtividade);
    return this.novaAtividadeService.vinculaIntervencao(
      +id,
      createAtividade.atividade_id,
      createAtividade,
    );
  }
}
