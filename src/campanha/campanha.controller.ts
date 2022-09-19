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
import { CampanhaService } from './campanha.service';
import { CreateAtividadeCampanhaDto } from './dto/create-atividade-campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { CampanhaFilhoDto } from './dto/create-filho.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

//@UseGuards(JwtAuthGuard)
@Controller('campanha')
export class CampanhaController {
  constructor(private readonly campanhaService: CampanhaService) {}

  @Post()
  createPai(@Body() createCampanhaDto: CreateCampanhaDto) {
    return this.campanhaService.createPai(createCampanhaDto);
  }

  @Post('/filho')
  createFilho(@Body() createCampanhaDto: CampanhaFilhoDto) {
    return this.campanhaService.createFilho(createCampanhaDto);
  }

  @Post('/filho/atividade')
  createAtividade(
    @Body() createAtividadeCampanhaDto: CreateAtividadeCampanhaDto,
  ) {
    return this.campanhaService.createAtividade(createAtividadeCampanhaDto);
  }

  @Get()
  findAll() {
    return this.campanhaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campanhaService.findOne(+id);
  }

  @Get('/atividades/:id')
  findAtividades(@Param('id') id: string) {
    return this.campanhaService.findAtividades(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.campanhaService.update(+id, campo, valor);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.campanhaService.remove(+id, user);
  }
}
