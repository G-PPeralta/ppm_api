import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

@UseGuards(JwtAuthGuard)
@Controller('projetos-financeiro')
export class ProjetosFinanceiroController {
  constructor(
    private readonly projetosFinanceiroService: ProjetosFinanceiroService,
  ) {}

  @Get('pai')
  findPais() {
    return this.projetosFinanceiroService.findPais();
  }

  @Get('filhos/:id/')
  findFilhos(@Param('id') id: string) {
    return this.projetosFinanceiroService.findFilhos(+id);
  }

  @Delete('delete/:id')
  apagarFinanceirosPorPai(@Param('id') id: string) {
    return this.projetosFinanceiroService.apagarFinanceirosPorPai(+id);
  }
}
