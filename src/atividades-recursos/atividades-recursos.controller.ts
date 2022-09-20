import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AtividadesRecursosService } from './atividades-recursos.service';
import { CreateAtividadesRecursosDto } from './dto/create-atividades-recursos.dto';

@Controller('atividades-recursos')
export class AtividadesRecursosController {
  constructor(
    private readonly atividadesRecursosService: AtividadesRecursosService,
  ) {}

  @Post()
  create(@Body() createAtividadesRecursosDto: CreateAtividadesRecursosDto) {
    return this.atividadesRecursosService.create(createAtividadesRecursosDto);
  }

  @Get()
  findAll() {
    return this.atividadesRecursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesRecursosService.findOne(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.atividadesRecursosService.update(+id, campo, valor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadesRecursosService.remove(+id);
  }
}
