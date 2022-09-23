import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class EstatisticasService {
  constructor(private prisma: PrismaService) {}

  async estatisticasCampanha() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select 
    campanha.nom_campanha as sonda,
    poco.nom_atividade as poco,
    poco.id as id_poco,
    atividades.nom_atividade as nome_atividade,
    atividades.id as id_atividade,
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
        fn_hrs_uteis_totais_atv(atividades.dat_ini_plan, atividades.dat_fim_plan) / fn_atv_calc_hrs_totais(poco.id) -- valor ponderado
    )*100,1) as pct_plan,
    '' as nome_responsavel
    from
    tb_campanha campanha
    inner join tb_camp_atv_campanha poco
    on (campanha.id = poco.id_campanha and poco.id_pai = 0 and poco.dat_usu_erase is null
    and campanha.dat_usu_erase is null
    )
    inner join tb_camp_atv_campanha atividades
    on (atividades.id_pai = poco.id and atividades.id_pai != 0 and atividades.dat_usu_erase is null)
    group by campanha.nom_campanha, 
    poco.nom_atividade, poco.id, atividades.nom_atividade,
    atividades.id, atividades.dat_ini_plan, atividades.dat_fim_plan,
    atividades.dat_ini_plan, atividades.dat_ini_real 
    order by atividades.id_pai asc, atividades.dat_ini_plan asc
    `);

    const tratamento = {};

    for (const {
      sonda,
      poco,
      id_poco,
      nome_atividade,
      id_atividade,
      custo,
      inicio_planejado,
      fim_planejado,
      hrs_totais,
      hrs_reais,
      inicio_real,
      fim_real,
      nome_responsavel,
      pct_plan,
    } of retorno) {
      if (!tratamento[sonda]) tratamento[sonda] = {};
      if (!tratamento[sonda][poco]) tratamento[sonda][poco] = [];
      tratamento[sonda][poco].push({
        id_poco,
        nome_atividade,
        id_atividade,
        custo,
        inicio_planejado,
        fim_planejado,
        hrs_totais,
        hrs_reais,
        inicio_real,
        fim_real,
        nome_responsavel,
        pct_plan,
      });
    }
    return tratamento;
  }
}
