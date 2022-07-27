import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateTipoProjetoDto } from './dto/create-tipo-projeto.dto';
import { UpdateTipoProjetoDto } from './dto/update-tipo-projeto.dto';

@Injectable()
export class TipoProjetoService {
  create(createTipoProjetoDto: CreateTipoProjetoDto) {
    return 'This action adds a new tipoProjeto';
  }

  async findAll() {
    return await prismaClient.tipoProjeto.findMany();
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
