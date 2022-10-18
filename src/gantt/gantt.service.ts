import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { ganttFormatter } from '../utils/gantt/gantConverter';
import { CreateGanttDto, GanttPayload } from './dto/create-gantt.dto';
import { UpdateGanttDto } from './dto/update-gantt.dto';

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
        b.nome_projeto,
          a.dat_ini_real,
          a.dat_fim_real,
          a.dat_ini_plan,
          a.dat_fim_plan,
          a.id as microatividade_id,
          a.nom_atividade as nome_atividade,
          macroatividade_id,
          (select nom_atividade from tb_projetos_atividade where id = macroatividade_id) as macroatividade_nome,
          case when weekdays_sql(ma.dat_ini_plan::date, ma.dat_fim_plan::date)::int <= 0 then 0 else weekdays_sql(ma.dat_ini_plan::date, ma.dat_fim_plan::date)::int - 1 end as duracao,
          a.pct_real as progresso
        from tb_projetos_atividade a
        inner join (
        select 
          case when ma.dat_ini_real is null then (select min(dat_ini_real) from tb_projetos_atividade where id_pai = ma.id) else ma.dat_ini_real end as dat_ini_real,
            case when ma.dat_fim_real is null then (select max(dat_fim_real) from tb_projetos_atividade where id_pai = ma.id) else ma.dat_fim_real end as dat_fim_real,
            case when ma.dat_ini_plan is null then (select min(dat_ini_plan) from tb_projetos_atividade where id_pai = ma.id) else ma.dat_ini_plan end as dat_ini_plan,
            case when ma.dat_fim_plan is null then (select max(dat_fim_plan) from tb_projetos_atividade where id_pai = ma.id) else ma.dat_fim_plan end as dat_fim_plan,
            ma.id as id,
            ma.id_pai as macroatividade_id
        from tb_projetos_atividade ma
        --	where id = a.id_pai
        ) as ma
        on a.id = ma.id
        inner join tb_projetos b
        on a.id_projeto = b.id
        where a.id_projeto = ${id} 
        and (a.id_pai is not null or not a.id_pai = 0) -- regra para não exibir a raiz do cronograma
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

  async updateGantt(updateGannt: UpdateGanttDto, id: number) {
    return await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atividade
      SET
      dat_ini_plan = TO_TIMESTAMP('${updateGannt.dat_ini_plan}', 'DD/MM/YYYY HH24:MI:ss'),
      dat_fim_plan = TO_TIMESTAMP('${updateGannt.dat_fim_plan}', 'DD/MM/YYYY HH24:MI:ss'),
      dat_ini_real = TO_TIMESTAMP('${updateGannt.dat_ini_real}', 'DD/MM/YYYY HH24:MI:ss'),
      dat_fim_real = TO_TIMESTAMP('${updateGannt.dat_fim_real}', 'DD/MM/YYYY HH24:MI:ss'),
      pct_real = ${updateGannt.pct_real}
      WHERE id = ${id}
`);
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
