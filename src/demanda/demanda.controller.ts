import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DemandaService } from './demanda.service';
import { CreateDemandaDto } from './dto/create-demanda.dto';
import { UpdateDemandaDto } from './dto/update-demanda.dto';

@Controller('demanda')
export class DemandaController {
  constructor(private readonly demandaService: DemandaService) {}

  @Post()
  create(@Body() createDemandaDto: CreateDemandaDto) {
    return this.demandaService.create(createDemandaDto);
  }

  @Get()
  findAll() {
    return this.demandaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemandaDto: UpdateDemandaDto) {
    return this.demandaService.update(+id, updateDemandaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandaService.remove(+id);
  }
}
