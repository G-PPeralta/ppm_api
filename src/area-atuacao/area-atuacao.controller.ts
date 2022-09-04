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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AreaAtuacaoService } from './area-atuacao.service';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { UpdateAreaAtuacaoDto } from './dto/update-area-atuacao.dto';

@UseGuards(JwtAuthGuard)
@Controller('area-atuacao')
export class AreaAtuacaoController {
  constructor(private readonly areaAtuacaoService: AreaAtuacaoService) {}

  @Post()
  create(@Body() createAreaAtuacaoDto: CreateAreaAtuacaoDto) {
    return this.areaAtuacaoService.create(createAreaAtuacaoDto);
  }

  @Get()
  findAll() {
    return this.areaAtuacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaAtuacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAreaAtuacaoDto: UpdateAreaAtuacaoDto,
  ) {
    return this.areaAtuacaoService.update(+id, updateAreaAtuacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areaAtuacaoService.remove(+id);
  }
}
