import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AtividadesNotasService } from './atividades-notas.service';
import { CreateAtividadesNotasDto } from './dto/create-atividades-notas.dto';

@Controller('atividades-notas')
export class AtividadesNotasController {
  constructor(
    private readonly atividadesNotasService: AtividadesNotasService,
  ) {}

  @Post()
  create(@Body() createAtividadesNotasDto: CreateAtividadesNotasDto) {
    return this.atividadesNotasService.create(createAtividadesNotasDto);
  }

  @Get()
  findAll() {
    return this.atividadesNotasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesNotasService.findOne(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.atividadesNotasService.update(+id, campo, valor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadesNotasService.remove(+id);
  }
}
