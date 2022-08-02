import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
// import { CreateResponsavelDto } from 'responsavel/dto/create-responsavel.dto';
import { prismaClient } from 'index.prisma';
import { ResponsavelService } from 'responsavel/responsavel.service';

@Controller('projetos')
export class ProjetosController {
  constructor(
    private readonly projetosService: ProjetosService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  @Post('/registro')
  async create(@Body() payload: CreateProjetoDto) {
    try {
      if (!payload.responsaveis) {
        return await this.projetosService.create(payload);
      }

      const responsaveis = payload.responsaveis;
      delete payload.responsaveis;

      const novoProjeto = await this.projetosService.create(payload);

      responsaveis.map(async (responsavel) => {
        const novoResponsavel = await this.responsavelService.create(
          responsavel,
        );
        await prismaClient.responsavel_Projeto.create({
          data: {
            projeto_id: novoProjeto.id,
            responsavel_id: novoResponsavel.id,
          },
        });
      });

      return { message: 'Projeto cadastrado com responsável' };
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.projetosService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/count-all-projects')
  async countAll() {
    try {
      const count = await this.projetosService.countAll();
      return count;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/find-total-value/:id')
  async findTotalValue(@Param('id') id: string) {
    try {
      const totalValue = await this.projetosService.findTotalValue(+id);
      return totalValue;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.projetosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetosService.update(+id, updateProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetosService.remove(+id);
  }
}
