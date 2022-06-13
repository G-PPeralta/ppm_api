import { Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefaService {
  async create(createTarefaDto: CreateTarefaDto) {
    console.log(createTarefaDto);
    const tarefa = await prisma.tarefa.create({ data: createTarefaDto });
    return tarefa;
  }

  async findAll() {
    const tarefas = await prisma.tarefa.findMany();
    return tarefas;
  }

  async findOne(id: number) {
    const tarefa = await prisma.tarefa.findUnique({ where: { id: id } });
    return tarefa;
  }

  update(id: number, updateTarefaDto: UpdateTarefaDto) {
    return `This action updates a #${id} tarefa`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarefa`;
  }
}
