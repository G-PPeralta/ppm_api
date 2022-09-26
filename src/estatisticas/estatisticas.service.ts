import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class EstatisticasService {
  constructor(private prisma: PrismaService) {}

  async estatisticasCampanha() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select 
    campanha.id as id_sonda,
campanha.nom_campanha as sonda,
poco.poco as poco,
pai.poco_id as id_poco,
tarefas.nom_atividade as nome_atividade,
filho.id as id_atividade, --verificar se é id da atividade ou da origem
0.00 as custo,
filho.dat_ini_plan as inicio_planejado,
filho.dat_fim_plan as fim_planejado,
fn_hrs_uteis_totais_atv(filho.dat_ini_plan, filho.dat_fim_plan) as hrs_totais,
case when fn_hrs_uteis_totais_atv(filho.dat_ini_real, filho.dat_fim_real) is null then 0 else fn_hrs_uteis_totais_atv(filho.dat_ini_real, filho.dat_fim_real) end as hrs_reais,
filho.dat_ini_real as inicio_real,
filho.dat_fim_real as fim_real,
round(fn_atv_calc_pct_plan(
        fn_atv_calcular_hrs(filho.dat_ini_plan), -- horas executadas
        fn_hrs_uteis_totais_atv(filho.dat_ini_plan, filho.dat_fim_plan),  -- horas totais
        fn_hrs_uteis_totais_atv(filho.dat_ini_plan, filho.dat_fim_plan) / fn_atv_calc_hrs_totais(pai.id) -- valor ponderado
    )*100,1) as pct_plan,
    responsaveis.nome_responsavel  as nome_responsavel
from
tb_campanha campanha
inner join tb_camp_atv_campanha pai
on pai.id_campanha = campanha.id
inner join 
tb_intervencoes_pocos poco on poco.id = pai.poco_id
inner join tb_camp_atv_campanha filho
on filho.id_pai = pai.id
inner join tb_camp_atv tarefas 
on tarefas.id = filho.tarefa_id
inner join tb_responsaveis responsaveis
on responsaveis.responsavel_id = filho.responsavel_id
where
pai.id_pai = 0
group by campanha.id, campanha.nom_campanha, poco.poco, pai.id,
    tarefas.nom_atividade, pai.poco_id, tarefas.nom_atividade,
    filho.id, filho.dat_ini_plan, filho.dat_fim_plan,
    filho.dat_ini_plan, filho.dat_ini_real, responsaveis.nome_responsavel 
    order by filho.id_pai asc, filho.dat_ini_plan asc
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
