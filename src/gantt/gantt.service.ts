import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { ganttFormatter } from '../utils/gantt/gantConverter';
import { CreateGanttDto, GanttPayload } from './dto/create-gantt.dto';

@Injectable()
export class GanttService {
  constructor(private prisma: PrismaService) {}
  create(createGanttDto: CreateGanttDto) {
    return 'This action adds a new gantt';
  }

  async findAll() {
    const gantt: GanttPayload[] = await this.prisma.$queryRaw(Prisma.sql`
      SELECT * FROM v_gantt_temp
    `);
    const ganttFormatted = ganttFormatter(gantt);
    if (!ganttFormatted) throw new Error('Falha na listagem de dados do gantt');
    return ganttFormatted;
  }

  findOne(id: number) {
    return `This action returns a #${id} gantt`;
  }

  // update(id: number, updateGanttDto: UpdateGanttDto) {
  //   return `This action updates a #${id} gantt`;
  // }

  remove(id: number) {
    return `This action removes a #${id} gantt`;
  }
}

/*

{
  "id": 1,
  "item": "id",
  "nomeProjeto": "nomeProjeto",
  "dataInicio": "2020-01-01",
  "dataFim": "2020-01-01",
  "duracao" (dataFim - dataInicio),
  "progresso": ???,
  "subtasks": [ // Atividade
    {
      "id": 1,
      "item": "item" + '.' + item,
    }
  ]
}

*/
