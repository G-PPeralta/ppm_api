import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SondaService } from './sonda.service';
import { CreateSondaDto } from './dto/create-sonda.dto';
import { UpdateSondaDto } from './dto/update-sonda.dto';

@Controller('sonda')
export class SondaController {
  constructor(private readonly sondaService: SondaService) {}

  @Post()
  create(@Body() createSondaDto: CreateSondaDto) {
    return this.sondaService.create(createSondaDto);
  }

  @Get()
  findAll() {
    return this.sondaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sondaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSondaDto: UpdateSondaDto) {
    return this.sondaService.update(+id, updateSondaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sondaService.remove(+id);
  }
}
