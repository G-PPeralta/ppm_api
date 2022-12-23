import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ClasseServicoService } from './classe-servico.service';

@UseGuards(JwtAuthGuard)
@Controller('classe-servico')
export class ClasseServicoController {
  constructor(private readonly service: ClasseServicoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
