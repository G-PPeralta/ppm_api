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
    select
    projetos.nome_projeto,
    microatividade.dat_ini_plan as data_inicio,
    microatividade.dat_fim_plan as data_fim,
    microatividade.id as microatividade_id,
    microatividade.nom_atividade as nome_atividade,
    macroatividade.id as macroatividade_id,
    macroatividade.nom_atividade as macroatividade_nome,
    date_part('day', age(microatividade.dat_fim_plan, microatividade.dat_ini_plan))  as duracao,
    microatividade.pct_real as progresso
    from
    tb_projetos_atividade projetos_atividade
    left join
    tb_projetos projetos
    on (projetos.id = projetos_atividade.id_projeto) and (coalesce(projetos_atividade.id_pai, 0) = 0)
    left join
    tb_projetos_atividade macroatividade
    on macroatividade.id_pai = projetos_atividade.id
    left join
    tb_projetos_atividade microatividade
    on microatividade.id_pai = macroatividade.id
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

  async findOne(id: number) {
    const gantt: GanttPayload[] = await this.prisma.$queryRaw(Prisma.sql`
    select
    projetos.nome_projeto,
    microatividade.dat_ini_plan as data_inicio,
    microatividade.dat_fim_plan as data_fim,
    microatividade.id as microatividade_id,
    microatividade.nom_atividade as nome_atividade,
    macroatividade.id as macroatividade_id,
    macroatividade.nom_atividade as macroatividade_nome,
    date_part('day', age(microatividade.dat_fim_plan, microatividade.dat_ini_plan))  as duracao,
    microatividade.pct_real as progresso
    from
    tb_projetos_atividade projetos_atividade
    left join
    tb_projetos projetos
    on (projetos.id = projetos_atividade.id_projeto) and (coalesce(projetos_atividade.id_pai, 0) = 0)
    left join
    tb_projetos_atividade macroatividade
    on macroatividade.id_pai = projetos_atividade.id
    left join
    tb_projetos_atividade microatividade
    on microatividade.id_pai = macroatividade.id
    where projetos.id = ${id}
    `);
    if (gantt.length <= 0) return null;
    const ganttFormatted = ganttFormatter(gantt);
    if (!ganttFormatted) throw new Error('Falha na listagem de dados do gantt');
    return ganttFormatted;
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
