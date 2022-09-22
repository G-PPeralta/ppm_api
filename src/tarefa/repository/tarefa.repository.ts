import { Injectable } from '@nestjs/common';
import { TarefaEntity } from '../entities/tarefa.entity';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class TarefaRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<TarefaEntity> {
    return this.prisma.tarefa.findFirstOrThrow({ where: { id } });
  }
}
