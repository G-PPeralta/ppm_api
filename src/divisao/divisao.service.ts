import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateDivisaoDto } from './dto/create-divisao.dto';
import { UpdateDivisaoDto } from './dto/update-divisao.dto';

@Injectable()
export class DivisaoService {
  constructor(private prisma: PrismaService) {}
  async create(createDivisaoDto: CreateDivisaoDto) {
    await this.prisma.divisaoProjeto.create({ data: createDivisaoDto });
  }

  findAll() {
    const divisoes = this.prisma.divisaoProjeto.findMany();
    if (!divisoes) throw new Error('Falha na listagem de divisões');
    return divisoes;
  }

  findOne(id: number) {
    return `This action returns a #${id} divisao`;
  }

  update(id: number, updateDivisaoDto: UpdateDivisaoDto) {
    return `This action updates a #${id} divisao`;
  }

  remove(id: number) {
    return `This action removes a #${id} divisao`;
  }
}
