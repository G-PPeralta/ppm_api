import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class EstatisticasService {
  constructor(private prisma: PrismaService) {}

  async estatisticasProjeto() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select
    sonda.id as id_sonda,
    sonda.nom_atividade as sonda,
    pocos.nom_atividade as poco,
    pocos.id as id_poco,
    case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end as nome_atividade,
    atividades.id as id_atividade, --verificar se é id da atividade ou da origem
    0.00 as custo,
    atividades.dat_ini_plan as inicio_planejado,
    atividades.dat_fim_plan as fim_planejado,
    fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan) as hrs_totais,
    case when fn_hrs_uteis_totais_atv(atividades.dat_ini_real, atividades.dat_fim_real) is null then 0 else fn_hrs_uteis_totais_atv(atividades.dat_ini_real, atividades.dat_fim_real) end as hrs_reais,
    atividades.dat_ini_real as inicio_real,
    atividades.dat_fim_real as fim_real,
    round(fn_atv_calc_pct_plan(
            fn_atv_calcular_hrs(atividades.dat_ini_plan), -- horas executadas
            fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan),  -- horas totais
            fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan) / fn_atv_calc_hrs_totais_projetos(pocos.id) -- valor ponderado
        )*100,1) as pct_plan,
        responsaveis.nome_responsavel as nome_responsavel
    from
    tb_projetos_atividade sonda
    inner join tb_projetos_atividade pocos
    on pocos.id_pai = sonda.id
    inner join tb_projetos_atividade atividades
    on (atividades.id_pai = pocos.id)
    left join tb_projetos_operacao tarefas
    on (tarefas.id = atividades.id_operacao)
    left join tb_responsaveis responsaveis
    on responsaveis.responsavel_id = atividades.id_responsavel
    where
    sonda.id_pai = 0
    group by 
    sonda.id, sonda.nom_atividade, pocos.nom_atividade, pocos.id,
    case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end,
    atividades.id, atividades.dat_ini_plan, atividades.dat_fim_plan, atividades.dat_ini_real, atividades.dat_ini_plan,
    responsaveis.nome_responsavel
    order by atividades.id_pai asc, atividades.dat_ini_plan asc
    `);

    const tratamento = [];

    retorno.forEach((e) => {
      let existe = false;

      const poco = {
        id_poco: e.id_poco,
        poco: e.poco,
        atividades: [],
      };

      const atividade = {
        nome_atividade: e.nome_atividade,
        id_atividade: e.id_atividade,
        custo: e.custo,
        inicio_planejado: e.inicio_planejado,
        fim_planejado: e.fim_planejado,
        hrs_totais: e.hrs_totais,
        hrs_reais: e.hrs_reais,
        inicio_real: e.inicio_real,
        fim_real: e.fim_real,
        pct_plan: e.pct_plan,
        nome_responsavel: e.nome_responsavel,
      };

      tratamento.forEach((t) => {
        if (t.sonda === e.sonda) {
          existe = true;

          let poco_existe = false;

          t.pocos.forEach((inner) => {
            if (inner.poco === e.poco) {
              poco_existe = true;
              inner.atividades.push(atividade);
            }
          });

          if (!poco_existe) {
            poco.atividades.push(atividade);
            t.pocos.push(poco);
          }
        }
      });

      if (!existe) {
        const data = {
          sonda: e.sonda,
          id_sonda: e.id_sonda,
          pocos: [],
        };

        poco.atividades.push(atividade);

        data.pocos.push(poco);

        tratamento.push(data);
      }
    });

    return tratamento;
  }
}
