import { Controller, Post } from '@nestjs/common';
import { CreateNovaOperacao } from './dto/create-nova-operacao.dto';
import { NovaOperacaoService } from './nova-operacao.service';

@Controller('nova-operacao')
export class NovaOperacaoController {
  constructor(private readonly novaOperacaoService: NovaOperacaoService) {}

  @Post()
  create(createNovaOperacao: CreateNovaOperacao) {
    return this.novaOperacaoService.create(createNovaOperacao);
  }
}
