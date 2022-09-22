import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateTipoProjetoDto } from './dto/create-tipo-projeto.dto';
import { UpdateTipoProjetoDto } from './dto/update-tipo-projeto.dto';

@Injectable()
export class TipoProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createTipoProjetoDto: CreateTipoProjetoDto) {
    const tipo = await this.prisma.tipoProjeto.create({
      data: createTipoProjetoDto,
    });
    return tipo;
  }

  async findAll() {
    return await this.prisma.tipoProjeto.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoProjeto`;
  }

  update(id: number, updateTipoProjetoDto: UpdateTipoProjetoDto) {
    return `This action updates a #${id} tipoProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoProjeto`;
  }
}
