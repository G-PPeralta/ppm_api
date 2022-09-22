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
import { ComplexidadeService } from './complexidade.service';
import { CreateComplexidadeDto } from './dto/create-complexidade.dto';
import { UpdateComplexidadeDto } from './dto/update-complexidade.dto';

@UseGuards(JwtAuthGuard)
@Controller('complexidade')
export class ComplexidadeController {
  constructor(private readonly complexidadeService: ComplexidadeService) {}

  @Post()
  create(@Body() createComplexidadeDto: CreateComplexidadeDto) {
    return this.complexidadeService.create(createComplexidadeDto);
  }

  @Get()
  findAll() {
    return this.complexidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complexidadeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplexidadeDto: UpdateComplexidadeDto,
  ) {
    return this.complexidadeService.update(+id, updateComplexidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complexidadeService.remove(+id);
  }
}
