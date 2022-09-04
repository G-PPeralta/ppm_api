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
import { SolicitanteService } from './solicitante.service';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('solicitante')
export class SolicitanteController {
  constructor(private readonly solicitanteService: SolicitanteService) {}

  @Post()
  create(@Body() createSolicitanteDto: CreateSolicitanteDto) {
    return this.solicitanteService.create(createSolicitanteDto);
  }

  @Get()
  findAll() {
    try {
      return this.solicitanteService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitanteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSolicitanteDto: UpdateSolicitanteDto,
  ) {
    return this.solicitanteService.update(+id, updateSolicitanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitanteService.remove(+id);
  }
}
