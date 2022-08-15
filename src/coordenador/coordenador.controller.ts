import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoordenadorService } from './coordenador.service';
import { CreateCoordenadorDto } from './dto/create-coordenador.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenador.dto';

@Controller('coordenador')
export class CoordenadorController {
  constructor(private readonly coordenadorService: CoordenadorService) {}

  @Post()
  create(@Body() createCoordenadorDto: CreateCoordenadorDto) {
    return this.coordenadorService.create(createCoordenadorDto);
  }

  @Get()
  findAll() {
    return this.coordenadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenadorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoordenadorDto: UpdateCoordenadorDto,
  ) {
    return this.coordenadorService.update(+id, updateCoordenadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenadorService.remove(+id);
  }
}
