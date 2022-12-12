import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GraficosService {
  constructor(private prisma: PrismaService) {}

  getHistoricoTotal() {
    const query = Prisma.sql`select 
        round(avg(hrs_totais),0) as hrs_media,
        round(min(hrs_totais),0) hrs_min,
        round(max(hrs_totais),0) hrs_max,
        0 as hrs_dp,
        0 as tend_duracao
    from tb_hist_estatistica a`;
    return this.prisma.$queryRaw(query);
  }

  async getRelatorioHistoricoPorPoco(params) {
    let where = '';
    const { de, a, sonda } = params;
    if (de && a) {
      where = ` and a.dat_conclusao between '${new Date(
        de,
      ).toISOString()}' and '${new Date(a).toISOString()}' `;
    }
    if (sonda) where += ` and id_sonda = ${sonda} `;
    const query = `select 
          nom_poco,
          id_poco,
          id_sonda,
          round(avg(hrs_totais),0) as hrs_media,
          round(min(hrs_totais),0) hrs_min,
          round(max(hrs_totais),0) hrs_max,
          0 as hrs_dp,
          0 as tend_duracao
      from tb_hist_estatistica a
      inner join tb_pocos b 
        on a.id_poco = b.id
      where 1=1
      ${where}
      group by id_poco, nom_poco, id_sonda;`;
    // --    id_operacao = 14
    // --and num_profundidade between 500 and 1000
    // --and id_sonda in (26)
    // --and id_poco in (77)
    return this.prisma.$queryRawUnsafe(query);
  }

  async getRelatorioPorCadaIntervencao(params) {
    let where = '';
    const { de, a } = params;
    if (de && a) {
      const from_temp = new Date(de).getTime() + 3 * 3600 * 1000;
      const from = new Date(from_temp).setHours(-3, 0, 0, 0);
      const to_temp = new Date(a).getTime() + 3 * 3600 * 1000;
      const to = new Date(to_temp).setHours(20, 59, 59, 0);
      where = ` and a.dat_conclusao between '${new Date(
        from,
      ).toISOString()}' and '${new Date(to).toISOString()}' `;
    }
    //
    const query = `select 
      nom_poco,
      sum(hrs_npt_man) as hrs_manutencao,
      sum(hrs_npt_rec_ori) as hrs_recursos_origem,
      sum(hrs_npt_rec_cia) as hrs_recursos_cia,
      sum(hrs_npt_clima) as hrs_mudanca_climatica,
      sum(hrs_npt_inf_tec) as hrs_info_tecnicas,
      sum(hrs_npt_outros) as hrs_outros,
      sum(hrs_npt_man) + 
      sum(hrs_npt_rec_ori) +
      sum(hrs_npt_rec_cia) +
      sum(hrs_npt_clima) +
      sum(hrs_npt_inf_tec) +
      sum(hrs_npt_outros) as hrs_total
    from tb_hist_estatistica a
    inner join tb_pocos b 
        on a.id_poco = b.id
    where 1=1
    ${where}
    group by nom_poco;`;

    const query2 = `
      select 
      1 as id,
      concat('Manutenção ', coalesce (sum(hrs_npt_man),0), 'hrs') as status,
      '#f4dd06' as color
      from tb_hist_estatistica a
      where a.dat_conclusao between '2022-11-22 00:00:00.000' and '2022-11-22 23:59:59.000'
      union
      select 
        2 as id,
        concat('Informações Técnicas ', coalesce (sum(hrs_npt_inf_tec),0), 'hrs') as status,
        '#00b0f0' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        3 as id,
        concat('Recurso Cia de Serviço ', coalesce (sum(hrs_npt_rec_cia),0), 'hrs') as status,
        '#778bd7' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        4 as id,
        concat('Recurso Origem ', coalesce (sum(hrs_npt_rec_ori),0), 'hrs') as status,
        '#0047bb' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        5 as id,
        concat('Condições Climáticas ', coalesce (sum(hrs_npt_clima),0), 'hrs') as status,
        '#00b050' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        3 as id,
        concat('Aguardando Outros ', coalesce (sum(hrs_npt_outros),0), 'hrs') as status,
        '#7030a0' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
    `;

    const res1: any[] = await this.prisma.$queryRawUnsafe(query);

    const tratar = res1.map((el) => {
      return {
        nom_poco: el.nom_poco,
        hrs_manutencao: el.hrs_manutencao,
        hrs_recursos_origem: el.hrs_recursos_origem,
        hrs_recursos_cia: el.hrs_recursos_cia,
        hrs_mudanca_climatica: el.hrs_mudanca_climatica,
        hrs_info_tecnicas: el.hrs_info_tecnicas,
        hrs_outros: el.hrs_outros,
        hrs_total: el.hrs_total,
        intervencao: [],
      };
    });

    const res2: any[] = await this.prisma.$queryRawUnsafe(query2);

    const interv = res2.map((intervencao) => {
      return {
        id: intervencao.id,
        status: intervencao.status,
        color: intervencao.color,
      };
    });

    tratar[0].intervencao.push(interv);

    return tratar;
  }

  async getRelatorioTempoNPTPorSonda(params) {
    let where = '';
    const { de, a } = params;
    if (de && a) {
      const from_temp = new Date(de).getTime() + 3 * 3600 * 1000;
      const from = new Date(from_temp).setHours(-3, 0, 0, 0);
      const to_temp = new Date(a).getTime() + 3 * 3600 * 1000;
      const to = new Date(to_temp).setHours(20, 59, 59, 0);
      where = ` and a.dat_conclusao between '${new Date(
        from,
      ).toISOString()}' and '${new Date(to).toISOString()}' `;
    }

    const query = `select 
        nom_sonda,
        sum(hrs_npt_man) as hrs_manutencao,
        sum(hrs_npt_rec_ori) as hrs_recursos_origem,
        sum(hrs_npt_rec_cia) as hrs_recursos_cia,
        sum(hrs_npt_clima) as hrs_mudanca_climatica,
        sum(hrs_npt_inf_tec) as hrs_info_tecnicas,
        sum(hrs_npt_outros) as hrs_outros,
        sum(hrs_npt_man) + 
        sum(hrs_npt_rec_ori) +
        sum(hrs_npt_rec_cia) +
        sum(hrs_npt_clima) +
        sum(hrs_npt_inf_tec) +
        sum(hrs_npt_outros) as hrs_total
    from tb_hist_estatistica a
    inner join tb_sondas b 
        on a.id_sonda = b.id
    where 1=1
    ${where}
    group by nom_sonda;`;

    const query2 = `
      select 
      1 as id,
      concat('Manutenção ', coalesce (sum(hrs_npt_man),0), 'hrs') as status,
      '#f4dd06' as color
      from tb_hist_estatistica a
      where a.dat_conclusao between '2022-11-22 00:00:00.000' and '2022-11-22 23:59:59.000'
      union
      select 
        2 as id,
        concat('Informações Técnicas ', coalesce (sum(hrs_npt_inf_tec),0), 'hrs') as status,
        '#00b0f0' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        3 as id,
        concat('Recurso Cia de Serviço ', coalesce (sum(hrs_npt_rec_cia),0), 'hrs') as status,
        '#778bd7' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        4 as id,
        concat('Recurso Origem ', coalesce (sum(hrs_npt_rec_ori),0), 'hrs') as status,
        '#0047bb' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        5 as id,
        concat('Condições Climáticas ', coalesce (sum(hrs_npt_clima),0), 'hrs') as status,
        '#00b050' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
      union
      select 
        3 as id,
        concat('Aguardando Outros ', coalesce (sum(hrs_npt_outros),0), 'hrs') as status,
        '#7030a0' as color
      from tb_hist_estatistica a
      where 1=1 ${where}
    `;

    // Logger.log(query);

    const res1: any[] = await this.prisma.$queryRawUnsafe(query);

    const tratar = res1.map((el) => {
      return {
        nom_sonda: el.nom_sonda,
        hrs_manutencao: el.hrs_manutencao,
        hrs_recursos_origem: el.hrs_recursos_origem,
        hrs_recursos_cia: el.hrs_recursos_cia,
        hrs_mudanca_climatica: el.hrs_mudanca_climatica,
        hrs_info_tecnicas: el.hrs_info_tecnicas,
        hrs_outros: el.hrs_outros,
        hrs_total: el.hrs_total,
        intervencao: [],
      };
    });

    const res2: any[] = await this.prisma.$queryRawUnsafe(query2);

    const interv = res2.map((intervencao) => {
      return {
        id: intervencao.id,
        status: intervencao.status,
        color: intervencao.color,
      };
    });

    tratar[0].intervencao.push(interv);

    return tratar;
  }

  async;

  getRelatorioPorCadaSonda(params) {
    let where = '';
    const { de, a } = params;
    if (de && a) {
      where = ` and a.dat_conclusao between '${new Date(
        de,
      ).toISOString()}' and '${new Date(a).toISOString()}' `;
    }
    const query = `select 
      nom_sonda,
      sum(hrs_totais) as hrs_totais
    from tb_hist_estatistica a
    inner join tb_sondas b 
        on a.id_sonda = b.id
    where 1=1
    ${where}
    group by nom_sonda;`;
    return this.prisma.$queryRawUnsafe(query);
  }

  // -- GRAFICO - DURACAO DE INTERVENCAO NORMALIZADA PELA METRAGEM DA ZONA INTERVIDA -- ???
  getRelatorioParaCPI(params) {
    let where = '';
    const { de, a } = params;
    if (de && a) {
      where = ` and a.dat_conclusao between '${new Date(
        de,
      ).toISOString()}' and '${new Date(a).toISOString()}' `;
    }
    const query = `
    select 
        nom_poco,
        case when max(num_profundidade) is null or max(num_profundidade) = 0 then
            round(0, 2)
        else
            round(sum(hrs_totais)/max(num_profundidade), 2) 
        end as taxa
    from (
        select 
            id_poco,
            hrs_totais,
            num_profundidade
        from tb_hist_estatistica a
        where 1=1
        ${where}
    ) as q
    inner join tb_pocos tp 
        on    q.id_poco = tp.id 
        group by nom_poco;`;

    Logger.log(query);
    // --where
    // --and num_profundidade between 500 and 1000
    // --and id_sonda in (26)
    // --and id_poco in (77)
    // --and dat_conclusao between '2022-09-01' and '2022-10-31'
    return this.prisma.$queryRawUnsafe(query);
  }
}
