import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  create(createProjetoDto: CreateProjetoDto) {
    return 'This action adds a new projeto';
  }

  async findAll() {
    return `This action returns all projetos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projeto`;
  }

  update(id: number, updateProjetoDto: UpdateProjetoDto) {
    return `This action updates a #${id} projeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await prismaClient.$queryRaw(
      Prisma.sql`select count(*) from load_mer.tb_projetos`,
    );
    if (!count) throw new NotFoundException('Falha na contagem de projetos');
    return count;
  }
}
