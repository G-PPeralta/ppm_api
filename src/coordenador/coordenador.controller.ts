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
    const coordenador = createCoordenadorDto.coordenadores.map(async (coo) => {
      const coordenadorAlreadyExists = await this.coordenadorService.findByName(
        coo.coordenadorNome,
      );
      if (coordenadorAlreadyExists) {
        throw new ConflictException(
          `Coordenador ${coo.coordenadorNome} já cadastrado`,
        );
      }
      return await this.coordenadorService.create(coo);
    });
    return await Promise.all(coordenador);
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
