import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IntervencoesTipoService } from './intervencoes-tipo.service';
import { CreateIntervencoesTipoDto } from './dto/create-intervencoes-tipo.dto';
import { UpdateIntervencoesTipoDto } from './dto/update-intervencoes-tipo.dto';

@Controller('intervencoes-tipo')
export class IntervencoesTipoController {
  constructor(
    private readonly intervencoesTipoService: IntervencoesTipoService,
  ) {}

  @Post()
  create(@Body() createIntervencoesTipoDto: CreateIntervencoesTipoDto) {
    return this.intervencoesTipoService.create(createIntervencoesTipoDto);
  }

  @Get()
  findAll() {
    return this.intervencoesTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intervencoesTipoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntervencoesTipoDto: UpdateIntervencoesTipoDto,
  ) {
    return this.intervencoesTipoService.update(+id, updateIntervencoesTipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intervencoesTipoService.remove(+id);
  }
}
