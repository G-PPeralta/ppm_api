import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { DivisaoService } from './divisao.service';
import { CreateDivisaoDto } from './dto/create-divisao.dto';
import { UpdateDivisaoDto } from './dto/update-divisao.dto';

@Controller('divisao')
export class DivisaoController {
  constructor(private readonly divisaoService: DivisaoService) {}

  @Post()
  create(@Body() createDivisaoDto: CreateDivisaoDto) {
    return this.divisaoService.create(createDivisaoDto);
  }

  @Get()
  findAll() {
    try {
      return this.divisaoService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDivisaoDto: UpdateDivisaoDto) {
    return this.divisaoService.update(+id, updateDivisaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divisaoService.remove(+id);
  }
}
