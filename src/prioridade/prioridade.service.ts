import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreatePrioridadeDto } from './dto/create-prioridade.dto';
import { UpdatePrioridadeDto } from './dto/update-prioridade.dto';

@Injectable()
export class PrioridadeService {
  constructor(private prisma: PrismaService) {}
  create(_createPrioridadeDto: CreatePrioridadeDto) {
    return 'This action adds a new prioridade';
  }

  async findAll() {
    return await this.prisma.prioridadeProjeto.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} prioridade`;
  }

  update(id: number, _updatePrioridadeDto: UpdatePrioridadeDto) {
    return `This action updates a #${id} prioridade`;
  }

  remove(id: number) {
    return `This action removes a #${id} prioridade`;
  }
}
