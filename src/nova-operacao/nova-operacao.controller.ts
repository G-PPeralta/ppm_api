import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNovaOperacao } from './dto/create-nova-operacao.dto';
import { CreatePoco } from './dto/create-poco.dto';
import { CreateSonda } from './dto/create-sonda.dto';
import { NovaOperacaoService } from './nova-operacao.service';

@Controller('nova-operacao')
export class NovaOperacaoController {
  constructor(private readonly novaOperacaoService: NovaOperacaoService) {}

  @Post()
  create(@Body() createNovaOperacao: CreateNovaOperacao) {
    return this.novaOperacaoService.create(createNovaOperacao);
  }

  @Get()
  findAll() {
    return this.novaOperacaoService.findAll();
  }

  @Get('poco')
  findPocos() {
    return this.novaOperacaoService.findPoco();
  }

  @Get('sonda')
  findSonda() {
    return this.novaOperacaoService.findSonda();
  }

  @Post('poco')
  createPoco(@Body() createPoco: CreatePoco) {
    return this.novaOperacaoService.createPoco(createPoco);
  }

  @Post('sonda')
  createSonda(@Body() createSonda: CreateSonda) {
    return this.novaOperacaoService.createSonda(createSonda);
  }
}
