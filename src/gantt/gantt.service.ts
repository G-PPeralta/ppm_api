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

  async deleteRecursive(id: number, user: string) {
    const existe_filhos = await this.prisma.$queryRawUnsafe(`
      SELECT count(*) as existe FROM tb_projetos_atividade WHERE id_pai = ${id} and dat_usu_erase is null
    `);

    if (existe_filhos[0].existe > 0) {
      const filho: any[] = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM tb_projetos_atividade WHERE id_pai = ${id} and dat_usu_erase is null
      `);

      filho.forEach(async (e) => {
        await this.deleteRecursive(e.id, e.user);
      });

      //delete
      await this.prisma.$queryRawUnsafe(
        `UPDATE tb_projetos_atividade set dat_usu_erase = now(), nom_usu_erase = '${user}' WHERE id = ${id} and id_pai <> 0 and dat_usu_erase is null`,
      );
    } else {
      //delete
      await this.prisma.$queryRawUnsafe(
        `UPDATE tb_projetos_atividade set dat_usu_erase = now(), nom_usu_erase = '${user}' WHERE id = ${id} and id_pai <> 0 and dat_usu_erase is null`,
      );
    }
  }

  async findOneCampanha(id: number) {
    const retorno_inicial: any[] = await this.prisma.$queryRawUnsafe(`
    select
    campanha.id as TaskID,
    case when campanha.nom_atividade is null then vinculo_atv_poco.nom_atividade else campanha.nom_atividade end as TaskName,
    (select min(dat_ini_plan) from tb_camp_atv_campanha where id_pai = campanha.id) as BaselineStartDate,
    (select min(dat_fim_plan) from tb_camp_atv_campanha where id_pai = campanha.id) as BaselineEndDate,
    (select min(dat_ini_real) from tb_camp_atv_campanha where id_pai = campanha.id) as StartDate,
    (select min(dat_fim_real) from tb_camp_atv_campanha where id_pai = campanha.id) as EndDate, 
    null as Responsavel,
    (
      select fn_hrs_totais_cronograma_atvv(min(dat_ini_plan)::date, max(dat_fim_plan)::date)/24
      from tb_camp_atv_campanha where id_pai = campanha.id
      and dat_usu_erase is null
    ) as BaselineDuration,
    (
    select case when weekdays_sql(min(dat_ini_real)::date, max(dat_fim_real)::date)::int <= 0 then 0 else weekdays_sql(min(dat_ini_real)::date, max(dat_fim_real)::date)::int end
    from tb_camp_atv_campanha where id_pai = campanha.id
    and dat_usu_erase is null
    )
    as Duration,
    coalesce(round(campanha.pct_real::numeric, 1), 0) as Progress,
    null as Predecessor,
    (select count(*) from tb_camp_atv_campanha where id_pai = campanha.id )::int4 as subtasks
   from tb_camp_atv_campanha campanha
   left join tb_projetos_atividade vinculo_atv_poco
   on vinculo_atv_poco.id = campanha.poco_id
   where campanha.id_pai = 0 and campanha.id = ${id}
    `);

    const tratar = retorno_inicial.map((el) => {
      return {
        TaskID: el.taskid,
        TaskName: el.taskname,
        BaselineStartDate: el.baselinestartdate,
        BaselineEndDate: el.baselineenddate,
        StartDate: el.startdate,
        EndDate: el.enddate,
        BaselineDuration: el.baselineduration,
        Duration: el.duration,
        Progress: el.progress,
        Predecessor: el.predecessor,
        SubtaskAmount: el.subtasks,
        Responsavel: el.responsavel,
        subtasks: [],
      };
    });

    const retornar = async () => {
      const tratamento: any[] = [];
      for (const e of tratar) {
        await this.substasksRecursiveCampanha(e);
        tratamento.push(e);
      }
      return tratamento;
    };

    return await retornar();
  }

  async findCampanha() {
    const retorno_inicial: any[] = await this.prisma.$queryRawUnsafe(`
    select
    campanha.id as TaskID,
    case when campanha.nom_atividade is null then vinculo_atv_poco.nom_atividade else campanha.nom_atividade end as TaskName,
    (select min(dat_ini_plan) from tb_camp_atv_campanha where id_pai = campanha.id) as BaselineStartDate,
    (select min(dat_fim_plan) from tb_camp_atv_campanha where id_pai = campanha.id) as BaselineEndDate,
    (select min(dat_ini_real) from tb_camp_atv_campanha where id_pai = campanha.id) as StartDate,
    (select min(dat_fim_real) from tb_camp_atv_campanha where id_pai = campanha.id) as EndDate, 
    null as Responsavel,
    (
      select fn_hrs_totais_cronograma_atvv(min(dat_ini_plan)::date, max(dat_fim_plan)::date)/24
      from tb_camp_atv_campanha where id_pai = campanha.id
      and dat_usu_erase is null
    ) as BaselineDuration,
    (
    select case when weekdays_sql(min(dat_ini_real)::date, max(dat_fim_real)::date)::int <= 0 then 0 else weekdays_sql(min(dat_ini_real)::date, max(dat_fim_real)::date)::int end
    from tb_camp_atv_campanha where id_pai = campanha.id
    and dat_usu_erase is null
    )
    as Duration,
    coalesce(round(campanha.pct_real::numeric, 1), 0) as Progress,
    null as Predecessor,
    (select count(*) from tb_camp_atv_campanha where id_pai = campanha.id )::int4 as subtasks
   from tb_camp_atv_campanha campanha
   left join tb_projetos_atividade vinculo_atv_poco
   on vinculo_atv_poco.id = campanha.poco_id
   where campanha.id_pai = 0
    `);

    const tratar = retorno_inicial.map((el) => {
      return {
        TaskID: el.taskid,
        TaskName: el.taskname,
        BaselineStartDate: el.baselinestartdate,
        BaselineEndDate: el.baselineenddate,
        StartDate: el.startdate,
        EndDate: el.enddate,
        BaselineDuration: el.baselineduration,
        Duration: el.duration,
        Progress: el.progress,
        Predecessor: el.predecessor,
        SubtaskAmount: el.subtasks,
        Responsavel: el.responsavel,
        subtasks: [],
      };
    });

    const retornar = async () => {
      const tratamento: any[] = [];
      for (const e of tratar) {
        await this.substasksRecursiveCampanha(e);
        tratamento.push(e);
      }
      return tratamento;
    };

    return await retornar();
  }

  async substasksRecursiveCampanha(element) {
    if (element.SubtaskAmount > 0) {
      const substasks: any[] = await this.prisma.$queryRawUnsafe(`
      select
      campanha.id as TaskID,
      case when campanha.nom_atividade is null then tarefas.nom_atividade else campanha.nom_atividade end as TaskName,
      campanha.dat_ini_plan as BaselineStartDate,
      campanha.dat_fim_plan as BaselineEndDate,
      campanha.dat_ini_real as StartDate,
      campanha.dat_fim_real as EndDate, 
      responsaveis.nome_responsavel as Responsavel,
      fn_hrs_totais_cronograma_atvv(campanha.dat_ini_plan::date, campanha.dat_fim_plan::date)/24 as BaselineDuration,
      case when weekdays_sql(campanha.dat_ini_real::date, campanha.dat_fim_real::date)::int <= 0 then 0 else weekdays_sql(campanha.dat_ini_real::date, campanha.dat_fim_real::date)::int end as Duration,
      coalesce(round(campanha.pct_real::numeric, 1), 0) as Progress,
      null as Predecessor,
      (select count(*) from tb_camp_atv_campanha where id_pai = campanha.id )::int4 as subtasks
     from tb_camp_atv_campanha campanha
     left join tb_responsaveis responsaveis
     on responsaveis.responsavel_id = campanha.responsavel_id
     left join tb_camp_atv tarefas
     on tarefas.id = campanha.tarefa_id
     where campanha.id_pai = ${element.TaskID}
      `);
      const mapped = substasks.map((el) => {
        return {
          TaskID: el.taskid,
          TaskName: el.taskname,
          BaselineStartDate: el.baselinestartdate,
          BaselineEndDate: el.baselineenddate,
          StartDate: el.startdate,
          EndDate: el.enddate,
          BaselineDuration: el.baselineduration,
          Duration: el.duration,
          Progress: el.progress,
          Predecessor: el.predecessor,
          SubtaskAmount: el.subtasks,
          Responsavel: el.responsavel,
          subtasks: [],
        };
      });

      const retornar = async () => {
        const tratamento: any[] = [];
        for (const e of mapped) {
          await this.substasksRecursiveCampanha(e);
          tratamento.push(e);
        }
        return tratamento;
      };

      element.subtasks = await retornar();
    }
  }

  async findOne(id: number) {
    const retorno_inicial: any[] = await this.prisma.$queryRawUnsafe(`
    select
    a.id as TaskID,
    nom_atividade as TaskName,
    dat_ini_plan as BaselineStartDate,
    dat_fim_plan as BaselineEndDate,
    dat_ini_real as StartDate,
    dat_fim_real as EndDate,
    nom_responsavel as Responsavel,
    fn_hrs_totais_cronograma_atvv(dat_ini_plan::date, dat_fim_plan::date)/24 as BaselineDuration,
    --case when weekdays_sql(dat_ini_plan::date, dat_fim_plan::date)::int <= 0 then 0 else weekdays_sql(dat_ini_plan::date, dat_fim_plan::date)::int end as BaselineDuration,
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
    left join tb_responsavel_atv_projeto on
    a.id_responsavel = tb_responsavel_atv_projeto.id
    where (id_pai = 0 or id_pai is null) -- NULL SOMENTE NO PRIMEIRO NÓ ATE RESOLVER A CAGADA)
    and id_projeto = ${id};
    `);

    const tratar = retorno_inicial.map((el) => {
      return {
        TaskID: el.taskid,
        TaskName: el.taskname,
        BaselineStartDate: el.baselinestartdate,
        BaselineEndDate: el.baselineenddate,
        StartDate: el.startdate,
        EndDate: el.enddate,
        BaselineDuration: el.baselineduration,
        Duration: el.duration,
        Progress: el.progress,
        Predecessor: el.predecessor,
        SubtaskAmount: el.subtasks,
        Responsavel: el.responsavel,
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
        a.id as TaskID,
        nom_atividade as TaskName,
        dat_ini_plan as BaselineStartDate,
        dat_fim_plan as BaselineEndDate,
        dat_ini_real as StartDate,
        dat_fim_real as EndDate,
        nom_responsavel as Responsavel,
        fn_hrs_totais_cronograma_atvv(dat_ini_plan::date, dat_fim_plan::date)/24 as BaselineDuration,
        --case when weekdays_sql(dat_ini_plan::date, dat_fim_plan::date)::int <= 0 then 0 else weekdays_sql(dat_ini_plan::date, dat_fim_plan::date)::int end as BaselineDuration,
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
        left join tb_responsavel_atv_projeto on
        a.id_responsavel = tb_responsavel_atv_projeto.id
        where (id_pai = ${element.TaskID}) and a.dat_usu_erase is null
        and id_projeto = ${id};
      `);
      const mapped = substasks.map((el) => {
        return {
          TaskID: el.taskid,
          TaskName: el.taskname,
          BaselineStartDate: el.baselinestartdate,
          BaselineEndDate: el.baselineenddate,
          StartDate: el.startdate,
          EndDate: el.enddate,
          BaselineDuration: el.baselineduration,
          Duration: el.duration,
          Progress: el.progress,
          Predecessor: el.predecessor,
          SubtaskAmount: el.subtasks,
          Responsavel: el.responsavel,
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
            : "'" + new Date(updateGannt.dat_ini_plan).toISOString() + "'"
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
        },
        null,
        ${
          updateGannt.nome_atividade === null
            ? null
            : "'" + updateGannt.nome_atividade + "'"
        }
    );
`;

    Logger.log(sqlQuery);
    return await this.prisma.$queryRawUnsafe(sqlQuery);
  }

  async getPanoramaGeral() {
    const init: any[] = await this.prisma.$queryRaw(Prisma.sql`
    select
      a.id as TaskID,
      nom_atividade as TaskName,
      dat_ini_plan as StartDatePlan,
      dat_fim_plan as EndDatePlan,
      dat_ini_real as StartDate,
      dat_fim_real as EndDate,
      case when weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int <= 0 then 0 else weekdays_sql(dat_ini_real::date, dat_fim_real::date)::int end as Duration,
      (select count(*) from tb_projetos_atividade where id_pai = a.id)::int4 as subtasks
    from tb_projetos_atividade a
      inner join tb_projetos b
        on a.id_projeto = b.id
    where 
      b.tipo_projeto_id in (1,2)
      and (a.id_pai = 0 or a.id_pai is null)
    `);

    const formated = init.map((el) => ({
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
    }));

    const fill = async () => {
      const filled: any[] = [];
      for (const e of formated) {
        await this.substasksForAll(e);
        filled.push(e);
      }
      return filled;
    };

    return await fill();
  }

  async substasksForAll(element) {
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
        (select count(*) from tb_projetos_atividade where id_pai = a.id)::int4 as subtasks
        from tb_projetos_atividade a
        where (id_pai = ${element.TaskID})
        and dat_usu_erase is null;
      `);
      const formated = substasks.map((el) => ({
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
      }));

      const fill = async () => {
        const filled: any[] = [];
        for (const e of formated) {
          await this.substasksForAll(e);
          filled.push(e);
        }
        return filled;
      };

      element.subtasks = await fill();
    }
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
