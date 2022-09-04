import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClassificacaoService } from './classificacao.service';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';

@UseGuards(JwtAuthGuard)
@Controller('classificacao')
export class ClassificacaoController {
  constructor(private readonly classificacaoService: ClassificacaoService) {}

  @Post()
  create(@Body() createClassificacaoDto: CreateClassificacaoDto) {
    return this.classificacaoService.create(createClassificacaoDto);
  }

  @Get()
  findAll() {
    try {
      return this.classificacaoService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classificacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassificacaoDto: UpdateClassificacaoDto,
  ) {
    return this.classificacaoService.update(+id, updateClassificacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificacaoService.remove(+id);
  }
}
