import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IntervencoesService } from './intervencoes.service';
import { CreateIntervencaoDto } from './dto/create-intervencao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('intervencoes')
export class IntervencoesController {
  constructor(private readonly intervencoesService: IntervencoesService) {}

  @Post()
  create(@Body() createIntervencoeDto: CreateIntervencaoDto) {
    return this.intervencoesService.create(createIntervencoeDto);
  }

  /*@Get()
  findAll() {
    return this.intervencoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intervencoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntervencoeDto: UpdateIntervencoeDto) {
    return this.intervencoesService.update(+id, updateIntervencoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intervencoesService.remove(+id);
  }*/
}
