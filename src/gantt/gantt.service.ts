import { Injectable, Logger } from '@nestjs/common';
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

  async deleteRecursive(id: number) {
    const existe_filhos = await this.prisma.$queryRawUnsafe(`
      SELECT count(*) as existe FROM tb_projetos_atividade WHERE id_pai = ${id}
    `);

    if (existe_filhos[0].existe > 0) {
      const filho: any[] = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM tb_projetos_atividade WHERE id_pai = ${id}
      `);

      filho.forEach(async (e) => {
        await this.deleteRecursive(e.id);
      });

      //delete
      const ret = await this.prisma.$queryRawUnsafe(
        `UPDATE tb_projetos_atividade set dat_usu_erase = now() WHERE id = ${id}`,
      );
    } else {
      //delete
      const ret = await this.prisma.$queryRawUnsafe(
        `UPDATE tb_projetos_atividade set dat_usu_erase = now() WHERE id = ${id}`,
      );
    }
  }

  async findOne(id: number) {
    const retorno_inicial: any[] = await this.prisma.$queryRawUnsafe(`
    select
    id as TaskID,
    nom_atividade as TaskName,
    dat_ini_plan as StartDatePlan,
    dat_fim_plan as EndDatePlan,
    dat_ini_real as StartDate,
    dat_fim_real as EndDate,
    case when weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int <= 0 then 0 else weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int end as Duration,
    round(pct_real::numeric, 1) as Progress,
    (
      select 
      case when count(p.id_prec) = 0 then null else
      string_agg(concat(p.id_prec::varchar, 'FS+', p.dias::varchar, 'dias'), ',') end as precedente
      from tb_projetos_atividade_precedentes p
      where p.id_atv = a.id
    ) as Predecessor,
    (select count(*) from tb_projetos_atividade where id_pai = a.id)::int4 as subtasks
    from tb_projetos_atividade a
    where (id_pai = 0 or id_pai is null) -- NULL SOMENTE NO PRIMEIRO NÓ ATE RESOLVER A CAGADA)
    and id_projeto = ${id};
    `);

    const tratar = retorno_inicial.map((el) => {
      return {
        TaskID: el.taskid,
        TaskName: el.taskname,
        StartDatePlan: el.startdateplan,
        EndDatePlan: el.enddateplan,
        StartDate: el.startdate,
        EndDate: el.enddate,
        Duration: el.duration,
        Progress: el.progress,
        Predecessor: el.predecessor,
        SubtaskAmount: el.subtasks,
        subtasks: [],
      };
    });

    const retornar = async () => {
      const tratamento: any[] = [];
      for (const e of tratar) {
        await this.substasksRecursive(e, id);
        tratamento.push(e);
      }
      return tratamento;
    };

    return await retornar();
  }

  async substasksRecursive(element, id) {
    if (element.SubtaskAmount > 0) {
      const substasks: any[] = await this.prisma.$queryRawUnsafe(`
        select
        id as TaskID,
        nom_atividade as TaskName,
        dat_ini_plan as StartDatePlan,
        dat_fim_plan as EndDatePlan,
        dat_ini_real as StartDate,
        dat_fim_real as EndDate,
        case when weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int <= 0 then 0 else weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int end as Duration,
        round(pct_real::numeric, 1) as Progress,
        (
          select 
          case when count(p.id_prec) = 0 then null else
          string_agg(concat(p.id_prec::varchar, 'FS+', p.dias::varchar, 'dias'), ',') end as precedente
          from tb_projetos_atividade_precedentes p
          where p.id_atv = a.id
        ) as Predecessor,
        (select count(*) from tb_projetos_atividade where id_pai = a.id)::int4 as subtasks
        from tb_projetos_atividade a
        where (id_pai = ${element.TaskID}) and a.dat_usu_erase is null
        and id_projeto = ${id};
      `);
      const mapped = substasks.map((el) => {
        return {
          TaskID: el.taskid,
          TaskName: el.taskname,
          StartDatePlan: el.startdateplan,
          EndDatePlan: el.enddateplan,
          StartDate: el.startdate,
          EndDate: el.enddate,
          Duration: el.duration,
          Progress: el.progress,
          Predecessor: el.predecessor,
          SubtaskAmount: el.subtasks,
          subtasks: [],
        };
      });

      const retornar = async () => {
        const tratamento: any[] = [];
        for (const e of mapped) {
          await this.substasksRecursive(e, id);
          tratamento.push(e);
        }
        return tratamento;
      };

      element.subtasks = await retornar();
    }
  }

  // update(id: number, updateGanttDto: UpdateGanttDto) {
  //   return `This action updates a #${id} gantt`;
  // }

  remove(id: number) {
    return `This action removes a #${id} gantt`;
  }

  async updateGantt(updateGannt: UpdateGanttDto, id: number) {
    const sqlQuery = `
    call sp_up_projetos_atividade(
        ${id}, 
        ${
          updateGannt.dat_ini_plan === null
            ? null
            : "'" + new Date(updateGannt.dat_ini_real).toISOString() + "'"
        },
        ${
          updateGannt.duracao_dias === null
            ? null
            : "'" + updateGannt.duracao_dias + "'"
        },
        ${updateGannt.pct_real},
        ${
          updateGannt.dat_ini_real === null
            ? null
            : "'" + new Date(updateGannt.dat_ini_real).toISOString() + "'"
        },
        ${
          updateGannt.dat_fim_real === null
            ? null
            : "'" + new Date(updateGannt.dat_fim_real).toISOString() + "'"
        }
    );
`;

    Logger.log(sqlQuery);
    return await this.prisma.$queryRawUnsafe(sqlQuery);
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
