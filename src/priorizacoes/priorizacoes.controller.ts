import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PriorizacoesDto } from './dto/priorizacoes.dto';
import { PriorizacoesService } from './priorizacoes.service';

@UseGuards(JwtAuthGuard)
@Controller('priorizacoes')
export class PriorizacoesController {
  constructor(private readonly service: PriorizacoesService) {}

  @Get()
  getPriorizacoes() {
    return this.service.getPriorizacoes();
  }

  @Post()
  insertPriorizacoes(@Body() priorizacoes: PriorizacoesDto[]) {
    return this.service.insertPriorizacoes(priorizacoes);
  }
}
