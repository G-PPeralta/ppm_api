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
    const projects = await prismaClient.statusAtividade.findMany();
    if (!projects) throw new NotFoundException('Falha na listagem de projetos');
    return projects;
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
    const count = await prismaClient.projeto.count();
    if (!count) throw new NotFoundException('Falha na contagem de projetos');
    return count;
  }
}
