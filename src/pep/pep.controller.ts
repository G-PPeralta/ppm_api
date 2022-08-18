import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PepService } from './pep.service';
import { CreatePepDto } from './dto/create-pep.dto';
import { UpdatePepDto } from './dto/update-pep.dto';

@Controller('pep')
export class PepController {
  constructor(private readonly pepService: PepService) {}

  @Post()
  create(@Body() createPepDto: CreatePepDto) {
    return this.pepService.create(createPepDto);
  }

  @Get()
  findAll() {
    return this.pepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePepDto: UpdatePepDto) {
    return this.pepService.update(+id, updatePepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pepService.remove(+id);
  }
}
