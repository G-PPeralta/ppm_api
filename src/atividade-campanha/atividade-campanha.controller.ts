import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AtividadeCampanhaService } from './atividade-campanha.service';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { UpdateAtividadeCampanhaDto } from './dto/update-atividade-campanha.dto';

@Controller('atividade-campanha')
export class AtividadeCampanhaController {
  constructor(
    private readonly atividadeCampanhaService: AtividadeCampanhaService,
  ) {}

  @Post()
  create(@Body() createAtividadeCampanhaDto: CreateAtividadeCampanhaDto) {
    return this.atividadeCampanhaService.create(createAtividadeCampanhaDto);
  }

  @Get()
  findAll() {
    return this.atividadeCampanhaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadeCampanhaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAtividadeCampanhaDto: UpdateAtividadeCampanhaDto,
  ) {
    return this.atividadeCampanhaService.update(
      +id,
      updateAtividadeCampanhaDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadeCampanhaService.remove(+id);
  }
}
