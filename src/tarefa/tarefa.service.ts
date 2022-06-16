import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateTarefaDto } from './dto/create-tarefa.dto';

@Injectable()
export class TarefaService {
  async create(createTarefaDto: CreateTarefaDto) {
    const tarefa = await prismaClient.tarefa.create({ data: createTarefaDto });
    return tarefa;
  }

  async findAll() {
    return await prismaClient.tarefa.findMany();
  }

  async findOne(id: number) {
    const tarefa = await prismaClient.tarefa.findUnique({ where: { id: id } });
    return tarefa;
  }

  update(id: number) {
    return `This action updates a #${id} tarefa`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarefa`;
  }
}
