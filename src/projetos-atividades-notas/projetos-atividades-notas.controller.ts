import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProjetosAtividadeNotasDto } from './dto/create-projeto-atividade-notas.dto';
import { ProjetosAtividadesNotasService } from './projetos-atividades-notas.service';

@Controller('projetos-atividades-notas')
export class ProjetosAtividadesNotasController {
  constructor(
    private readonly projetosAtividadesNotasService: ProjetosAtividadesNotasService,
  ) {}

  @Post()
  create(
    @Body() createProjetosAtividadeNotasDto: CreateProjetosAtividadeNotasDto,
  ) {
    return this.projetosAtividadesNotasService.create(
      createProjetosAtividadeNotasDto,
    );
  }

  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.projetosAtividadesNotasService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetosAtividadesNotasService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetosAtividadesNotasService.remove(+id);
  }
}
