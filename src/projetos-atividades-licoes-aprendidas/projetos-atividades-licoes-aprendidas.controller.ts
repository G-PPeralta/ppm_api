import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProjetosAtividadeDto } from 'projetos-atividades/dto/create-projetos-atividades.dto';

@Controller('projetos-atividades-licoes-aprendidas')
export class ProjetosAtividadesLicoesAprendidasController {
  constructor(
    private readonly projetosAtividadesLicoesAprendidasService: ProjetosAtividadesLicoesAprendidasController,
  ) {}

  @Post()
  create(@Body() createProjetosAtividadeDto: CreateProjetosAtividadeDto) {
    return this.projetosAtividadesLicoesAprendidasService.create(
      createProjetosAtividadeDto,
    );
  }

  @Get()
  findAll() {
    return this.projetosAtividadesLicoesAprendidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetosAtividadesLicoesAprendidasService.findOne(id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.update(
      id,
      campo,
      valor,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetosAtividadesLicoesAprendidasService.remove(id);
  }
}
