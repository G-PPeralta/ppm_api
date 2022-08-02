import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreatePrioridadeDto } from './dto/create-prioridade.dto';
import { UpdatePrioridadeDto } from './dto/update-prioridade.dto';

@Injectable()
export class PrioridadeService {
  create(createPrioridadeDto: CreatePrioridadeDto) {
    return 'This action adds a new prioridade';
  }

  async findAll() {
    return await prismaClient.prioridadeProjeto.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} prioridade`;
  }

  update(id: number, updatePrioridadeDto: UpdatePrioridadeDto) {
    return `This action updates a #${id} prioridade`;
  }

  remove(id: number) {
    return `This action removes a #${id} prioridade`;
  }
}
