import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateLicoesAprendidasDto } from './dto/create-licoes-aprendidas.dto';
import { LicoesAprendidasService } from './licoes-aprendidas.service';

@UseGuards(JwtAuthGuard)
@Controller('licoes-aprendidas')
export class LicoesAprendidasController {
  constructor(
    private readonly licoesAprendidasService: LicoesAprendidasService,
  ) {}

  @Post()
  create(@Body() createLicoesAprendidasDto: CreateLicoesAprendidasDto) {
    return this.licoesAprendidasService.create(createLicoesAprendidasDto);
  }

  @Get()
  findAll() {
    return this.licoesAprendidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licoesAprendidasService.findOne(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.licoesAprendidasService.update(+id, campo, valor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licoesAprendidasService.remove(+id);
  }
}
