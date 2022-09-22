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
import { ProjetoIntervencaoService } from './projeto-intervencao.service';
import { CreateProjetoIntervencaoDto } from './dto/create-projeto-intervencao.dto';
import { UpdateProjetoIntervencaoDto } from './dto/update-projeto-intervencao.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projeto-intervencao')
export class ProjetoIntervencaoController {
  constructor(
    private readonly projetoIntervencaoService: ProjetoIntervencaoService,
  ) {}

  @Post()
  create(@Body() createProjetoIntervencaoDto: CreateProjetoIntervencaoDto) {
    return this.projetoIntervencaoService.create(createProjetoIntervencaoDto);
  }

  @Get()
  findAll() {
    return this.projetoIntervencaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetoIntervencaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjetoIntervencaoDto: UpdateProjetoIntervencaoDto,
  ) {
    return this.projetoIntervencaoService.update(
      +id,
      updateProjetoIntervencaoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetoIntervencaoService.remove(+id);
  }
}
