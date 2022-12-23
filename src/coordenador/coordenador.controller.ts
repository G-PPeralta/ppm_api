import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoordenadorService } from './coordenador.service';
import { CreateCoordenadorDto } from './dto/create-coordenador.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenador.dto';

@UseGuards(JwtAuthGuard)
@Controller('coordenador')
export class CoordenadorController {
  constructor(private readonly coordenadorService: CoordenadorService) {}

  @Post()
  async create(@Body() createCoordenadorDto: CreateCoordenadorDto) {
    const coordenadorAlreadyExists = await this.coordenadorService.findByName(
      createCoordenadorDto.coordenadorNome,
    );
    //if (coordenadorAlreadyExists) {
    //  throw new ConflictException(
    //    `Coordenador ${createCoordenadorDto.coordenadorNome} já cadastrado`,
    //  );
    //}
    const coordenador = this.coordenadorService.create(createCoordenadorDto);

    return coordenador;
  }

  @Get()
  findAll() {
    return this.coordenadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenadorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoordenadorDto: UpdateCoordenadorDto,
  ) {
    return this.coordenadorService.update(+id, updateCoordenadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenadorService.remove(+id);
  }
}
