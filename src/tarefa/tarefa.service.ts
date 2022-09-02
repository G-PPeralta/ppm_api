import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefaService {
  async create(createTarefaDto: CreateTarefaDto) {
    const tarefa = await prismaClient.tarefa.create({ data: createTarefaDto });
    return tarefa;
  }

  async findAll() {
    const tarefa = await prismaClient.tarefa.findMany();
    return tarefa;
  }

  async findOne(id: number) {
    const tarefa = await prismaClient.tarefa.findUnique({ where: { id } });
    return tarefa;
  }

  update(id: number, updateTarefaDto: UpdateTarefaDto) {
    return prismaClient.tarefa.update({
      where: { id: id },
      data: { tarefa: updateTarefaDto.tarefa },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tarefa`;
  }
}
