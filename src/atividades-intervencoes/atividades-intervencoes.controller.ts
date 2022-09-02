import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';
import { CreateAtividadesIntervencoeDto } from './dto/create-atividades-intervencao.dto';
import { UpdateAtividadesIntervencoeDto } from './dto/update-atividades-intervencao.dto';

@Controller('atividades-intervencoes')
export class AtividadesIntervencoesController {
  constructor(
    private readonly atividadesIntervencoesService: AtividadesIntervencoesService,
  ) {}

  @Post()
  create(
    @Body() createAtividadesIntervencoeDto: CreateAtividadesIntervencoeDto,
  ) {
    return this.atividadesIntervencoesService.create(
      createAtividadesIntervencoeDto,
    );
  }

  @Get()
  findAll() {
    return this.atividadesIntervencoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesIntervencoesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAtividadesIntervencoeDto: UpdateAtividadesIntervencoeDto,
  ) {
    return this.atividadesIntervencoesService.update(
      +id,
      updateAtividadesIntervencoeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadesIntervencoesService.remove(+id);
  }
}
