import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Post()
  create(@Body() createProjetoDto: CreateProjetoDto) {
    return this.projetosService.create(createProjetoDto);
  }

  @Get()
  async findAll() {
    try {
      return this.projetosService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/count-all-projects')
  async countAll() {
    try {
      const count = await this.projetosService.countAll();
      return count;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/find-total-value/:id')
  async findTotalValue(@Param('id') id: string) {
    try {
      const totalValue = await this.projetosService.findTotalValue(+id);
      return totalValue;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.projetosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetosService.update(+id, updateProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetosService.remove(+id);
  }
}
