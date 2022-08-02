import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatusProjetoService } from './status-projeto.service';
import { CreateStatusProjetoDto } from './dto/create-status-projeto.dto';
import { UpdateStatusProjetoDto } from './dto/update-status-projeto.dto';

@Controller('status-projeto')
export class StatusProjetoController {
  constructor(private readonly statusProjetoService: StatusProjetoService) {}

  @Post()
  create(@Body() createStatusProjetoDto: CreateStatusProjetoDto) {
    return this.statusProjetoService.create(createStatusProjetoDto);
  }

  @Get()
  findAll() {
    return this.statusProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusProjetoDto: UpdateStatusProjetoDto,
  ) {
    return this.statusProjetoService.update(+id, updateStatusProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusProjetoService.remove(+id);
  }
}
