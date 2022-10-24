import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GraficosService {
  constructor(private prisma: PrismaService) {}
  async getRelatorioHistorico(dataIni?, dataFim?) {
    let where = '';
    if (dataIni && dataFim) {
      where = `and atividades.dat_ini_real >= '${new Date(
        dataIni,
      ).toISOString()}'
      and atividades.dat_fim_real <= '${new Date(dataFim).toISOString()}' `;
    }
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
    select t.id_sonda, t.sonda, t.poco, t.id_poco, 
      round(min(hrs_reais)) as vlr_min,
      round(max(hrs_reais)) as vlr_max,
      round(avg(hrs_reais)) as vlr_med 
    from (
      select
        sonda.id as id_sonda,
        sonda.nom_atividade as sonda,
        pocos.nom_atividade as poco,
        pocos.id as id_poco,
        case when atividades.nom_atividade is null then tarefas.nom_operacao 
        else atividades.nom_atividade end as nome_atividade,
        atividades.id as id_atividade, --verificar se é id da atividade ou da origem
        case when fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) is null then 0 
        else fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) end as hrs_reais
        from
        tb_projetos_atividade sonda
        inner join tb_projetos_atividade pocos
        on pocos.id_pai = sonda.id
        inner join tb_projetos_atividade atividades
        on (atividades.id_pai = pocos.id)
        left join tb_projetos_operacao tarefas
        on (tarefas.id = atividades.id_operacao)
        where
        sonda.id_pai = 0 ${where}
        group by 
        sonda.id, sonda.nom_atividade, pocos.nom_atividade, pocos.id,
        case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end,
        atividades.id
        order by atividades.id_pai asc, atividades.dat_ini_real asc
    ) as t
    group by t.id_poco, t.poco, t.id_sonda, t.sonda
    `);
    return retorno;
  }

  getRelatorioPorCadaIntervencao() {
    const query = Prisma.sql`select 
      nom_poco,
      sum(hrs_npt_man) as hrs_manutencao,
      sum(hrs_npt_rec_ori) as hrs_recursos_origem,
      sum(hrs_npt_rec_cia) as hrs_recursos_cia,
      sum(hrs_npt_clima) as hrs_mudanca_climatica,
      sum(hrs_npt_inf_tec) as hrs_info_tecnicas,
      sum(hrs_npt_outros) as hrs_outros
    from tb_hist_estatistica a
    inner join tb_pocos b 
        on a.id_poco = b.id
    group by nom_poco;`;
    return this.prisma.$queryRaw(query);
  }

  getRelatorioTempoNPTPorSonda() {
    const query = Prisma.sql`select 
        nom_sonda,
        sum(hrs_npt_man) as hrs_manutencao,
        sum(hrs_npt_rec_ori) as hrs_recursos_origem,
        sum(hrs_npt_rec_cia) as hrs_recursos_cia,
        sum(hrs_npt_clima) as hrs_mudanca_climatica,
        sum(hrs_npt_inf_tec) as hrs_info_tecnicas,
        sum(hrs_npt_outros) as hrs_outros
    from tb_hist_estatistica a
    inner join tb_sondas b 
        on a.id_sonda = b.id
    group by nom_sonda;`;
    return this.prisma.$queryRaw(query);
  }
}
