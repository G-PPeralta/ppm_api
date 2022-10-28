import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampanhaProjetoTipoService } from './campanha-projeto-tipo.service';
import { CreateCampanhaProjetoTipo } from './dto/create-campanha-projeto-tipo.dto';

@Controller('campanha-projeto-tipo')
export class CampanhaProjetoTipoController {
  constructor(private readonly service: CampanhaProjetoTipoService) {}

  @Post()
  create(@Body() createCampanhaProjetoTipo: CreateCampanhaProjetoTipo) {
    return this.service.create(createCampanhaProjetoTipo);
  }

  @Get()
  findProjetosTipo() {
    return this.service.findProjetos();
  }

  @Get(':id')
  findByProjetos(@Param('id') id: string) {
    return this.service.findRelacaoByProjeto(+id);
  }
}
