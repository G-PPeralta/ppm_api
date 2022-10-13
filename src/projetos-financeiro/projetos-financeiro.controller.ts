import { Controller, Get, Param } from '@nestjs/common';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

@Controller('projetos-financeiro')
export class ProjetosFinanceiroController {
  constructor(
    private readonly projetosFinanceiroService: ProjetosFinanceiroService,
  ) {}

  @Get('pai')
  findPais() {
    return this.projetosFinanceiroService.findPais();
  }

  @Get('filhos/:id')
  findFilhos(@Param('id') id: string) {
    return this.projetosFinanceiroService.findFilhos(+id);
  }
}
