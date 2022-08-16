import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoResponsavelService } from './tipo-responsavel.service';
import { CreateTipoResponsavelDto } from './dto/create-tipo-responsavel.dto';
import { UpdateTipoResponsavelDto } from './dto/update-tipo-responsavel.dto';

@Controller('tipo-responsavel')
export class TipoResponsavelController {
  constructor(
    private readonly tipoResponsavelService: TipoResponsavelService,
  ) {}

  @Post()
  create(@Body() createTipoResponsavelDto: CreateTipoResponsavelDto) {
    return this.tipoResponsavelService.create(createTipoResponsavelDto);
  }

  // @Get()
  // findAll() {
  //   return this.tipoResponsavelService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoResponsavelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoResponsavelDto: UpdateTipoResponsavelDto,
  ) {
    return this.tipoResponsavelService.update(+id, updateTipoResponsavelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoResponsavelService.remove(+id);
  }
}
