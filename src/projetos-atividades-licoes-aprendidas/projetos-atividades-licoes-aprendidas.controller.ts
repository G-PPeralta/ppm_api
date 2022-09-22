import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProjetosAtividadesLicoesAprendidasDto } from './dto/projetos-atividades-licoes-aprendidas.dto';
import { ProjetosAtividadesLicoesAprendidasService } from './projetos-atividades-licoes-aprendidas.service';

@Controller('projetos-atividades-licoes-aprendidas')
export class ProjetosAtividadesLicoesAprendidasController {
  constructor(
    private readonly projetosAtividadesLicoesAprendidasService: ProjetosAtividadesLicoesAprendidasService,
  ) {}

  @Post()
  create(
    @Body()
    createProjetosAtividadeDto: CreateProjetosAtividadesLicoesAprendidasDto,
  ) {
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
    return this.projetosAtividadesLicoesAprendidasService.findOne(+id);
  }

  @Patch(':id/:campo/:valor/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.projetosAtividadesLicoesAprendidasService.update(
      +id,
      campo,
      valor,
      user,
    );
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.projetosAtividadesLicoesAprendidasService.remove(+id, user);
  }
}
