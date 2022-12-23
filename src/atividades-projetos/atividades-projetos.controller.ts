import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AtividadesProjetosService } from './atividades-projetos.service';
import { CreateAtividadesProjetoDto } from './dto/create-atividades-projeto.dto';
import { UpdateAtividadesProjetoDto } from './dto/update-atividades-projeto.dto';

@UseGuards(JwtAuthGuard)
@Controller('atividades-projetos')
export class AtividadesProjetosController {
  constructor(
    private readonly atividadesProjetosService: AtividadesProjetosService,
  ) {}

  @Post()
  create(@Body() createAtividadesProjetoDto: CreateAtividadesProjetoDto) {
    return this.atividadesProjetosService.create(createAtividadesProjetoDto);
  }

  @Get()
  findAll() {
    return this.atividadesProjetosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesProjetosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAtividadesProjetoDto: UpdateAtividadesProjetoDto,
  ) {
    return this.atividadesProjetosService.update(
      +id,
      updateAtividadesProjetoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadesProjetosService.remove(+id);
  }
}
