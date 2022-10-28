import { Controller, Get } from '@nestjs/common';
import { ClasseServicoService } from './classe-servico.service';

@Controller('classe-servico')
export class ClasseServicoController {
  constructor(private readonly service: ClasseServicoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
