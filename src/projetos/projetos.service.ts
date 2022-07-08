import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  create(createProjetoDto: CreateProjetoDto) {
    return 'This action adds a new projeto';
  }

  async findAll() {
    const projects = await prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async findTotalValue(id: number) {
    const totalValue = await prismaClient.projeto.findUnique({
      where: { id },
      select: { valorTotalPrevisto: true },
    });
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
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
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }
}
