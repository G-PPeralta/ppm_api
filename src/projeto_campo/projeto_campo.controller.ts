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
import { ProjetoCampoService } from './projeto_campo.service';
import { CreateProjetoCampoDto } from './dto/create-projeto_campo.dto';
import { UpdateProjetoCampoDto } from './dto/update-projeto_campo.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('projeto-campo')
export class ProjetoCampoController {
  constructor(private readonly projetoCampoService: ProjetoCampoService) {}

  @Post()
  create(@Body() createProjetoCampoDto: CreateProjetoCampoDto) {
    return this.projetoCampoService.create(createProjetoCampoDto);
  }

  @Get()
  findAll() {
    return this.projetoCampoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetoCampoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjetoCampoDto: UpdateProjetoCampoDto,
  ) {
    return this.projetoCampoService.update(+id, updateProjetoCampoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetoCampoService.remove(+id);
  }
}
