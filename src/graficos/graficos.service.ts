import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GraficosService {
  constructor(private prisma: PrismaService) {}
  async getRelatorioHistorico(params) {
    let where = '';
    const { de, a, sonda } = params;
    if (de && a) {
      where = ` and a.dat_conclusao between '${new Date(
        de,
      ).toISOString()}' and '${new Date(a).toISOString()}' `;
    }
    if (sonda) where += ` and nom_sonda like '${sonda}' `;
    const query = `select 
          nom_sonda,
          nom_poco,
          id_operacao,
          id_poco,
          round(avg(hrs_totais),0) as hrs_media,
          round(min(hrs_totais),0) hrs_min,
          round(max(hrs_totais),0) hrs_max,
          0 as hrs_dp,
          0 as tend_duracao
      from tb_hist_estatistica a
      inner join tb_pocos b 
        on a.id_poco = b.id
      inner join tb_sondas c 
        on a.id_sonda = c.id 
      where 1=1
      ${where}
      group by id_operacao, id_poco, nom_poco, nom_sonda;`;
    // --    id_operacao = 14
    // --and num_profundidade between 500 and 1000
    // --and id_sonda in (26)
    // --and id_poco in (77)
    return this.prisma.$queryRawUnsafe(query);
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

  // -- GRAFICO - DURACAO DE INTERVENCAO NORMALIZADA PELA METRAGEM DA ZONA INTERVIDA -- ???
  getRelatorioIntervencaoNormal() {
    const query = Prisma.sql`
    select 
        nom_poco,
        sum(hrs_totais)/max(num_profundidade)
    from (
        select 
            id_poco,
            hrs_totais,
            num_profundidade
        from tb_hist_estatistica
    ) as q
    inner join tb_pocos tp 
        on    q.id_poco = tp.id 
        group by nom_poco;`;
    // --where
    // --and num_profundidade between 500 and 1000
    // --and id_sonda in (26)
    // --and id_poco in (77)
    // --and dat_conclusao between '2022-09-01' and '2022-10-31'
    return this.prisma.$queryRaw(query);
  }
}
