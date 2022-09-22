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

  async findAllGant() {
    const projetos = await this.prisma.projeto.findMany({
      select: { nomeProjeto: true, rl_tb_atividades_tb_projetos: true },
    });
    const projetosResult = await projetos.map(async (data) => {
      const atividades = [];
      if (data.rl_tb_atividades_tb_projetos != null) {
        for (const item in data.rl_tb_atividades_tb_projetos) {
          const atividadeReturn = await this.prisma.atividade.findFirst({
            where: { id: data.rl_tb_atividades_tb_projetos[item].atividade_id },
          });
          const atividade = {
            id: atividadeReturn.id,
            nome: atividadeReturn.nomeAtividade,
          };
          atividades.push(atividade);
        }
      }

      return {
        nome: data.nomeProjeto,
        atividades,
      };
    });
    return Promise.all(projetosResult);
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
