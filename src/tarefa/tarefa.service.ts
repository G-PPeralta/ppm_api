import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefaService {
  constructor(private prisma: PrismaService) {}

  async create(createTarefaDto: CreateTarefaDto) {
    const tarefa = await this.prisma.tarefa.create({ data: createTarefaDto });
    return tarefa;
  }

  async findAll() {
    const tarefa = await this.prisma.tarefa.findMany();
    return tarefa;
  }

  async findOne(id: number) {
    const tarefa = await this.prisma.tarefa.findUnique({ where: { id } });
    return tarefa;
  }

  update(id: number, updateTarefaDto: UpdateTarefaDto) {
    return this.prisma.tarefa.update({
      where: { id: id },
      data: { tarefa: updateTarefaDto.tarefa },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tarefa`;
  }
}
