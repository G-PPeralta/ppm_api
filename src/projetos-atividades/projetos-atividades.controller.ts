import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProjetosAtividadeDto } from './dto/create-projetos-atividades.dto';
import { CreateProjetosFilhoDto } from './dto/create-projetos-filho.dto';
import { ProjetosAtividadesService } from './projetos-atividades.service';

@Controller('projetos-atividades')
export class ProjetosAtividadesController {
  constructor(
    private readonly projetosAtividadesService: ProjetosAtividadesService,
  ) {}

  @Post()
  create(@Body() createProjetosAtividadesDto: CreateProjetosAtividadeDto) {
    return this.projetosAtividadesService.create(createProjetosAtividadesDto);
  }

  @Post('vincular')
  createFilho(@Body() payload: CreateProjetosFilhoDto) {
    return this.projetosAtividadesService.createFilho(payload);
  }

  @Get('find/operacoes')
  findOperacoes() {
    return this.projetosAtividadesService.findOperacoes();
  }

  @Get()
  findAll() {
    return this.projetosAtividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetosAtividadesService.findOne(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.projetosAtividadesService.update(+id, campo, valor);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.projetosAtividadesService.remove(+id, user);
  }
}
