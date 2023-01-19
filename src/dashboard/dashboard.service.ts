/**
 * CRIADO EM: 23/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviços relacionados a dados do dashboard
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { QueryAreasDemandadasDto } from './dto/areas-demandadas-projetos.dto';
import { GatesDto } from './dto/gates.dto';
import { TotalNaoPrevistoDto } from './dto/total-nao-previsto.dto';
import { TotalOrcamentoDto } from './dto/total-orcamento.dto';
import {
  ComplexidadesProjetoDto,
  PrioridadesProjetoDto,
  QueryTotalProjetosDto,
  TotalProjetosDto,
} from './dto/total-projetos.dto';
import { TotalRealizadoDto } from './dto/total-realizado.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  static errors = {
    totalOrcamento: {
      badRequestError: 'Query string param polo_id_param is not a number',
    },
  };

  async getGates() {
    const query: GatesDto[] = await this.prisma.$queryRawUnsafe(`
    SELECT
    g.gate AS gate,
    COUNT(p.id)::numeric AS qtde,
    CASE
        WHEN (
            SELECT
                COUNT(*)
            FROM
                tb_projetos tp
            WHERE
                tp.dat_usu_erase IS NULL AND
                tp.tipo_projeto_id <> 3
        ) = 0 THEN 0
        ELSE COUNT(p.id) * 100.0 / (
            SELECT
                COUNT(*)
            FROM
                tb_projetos tp
            WHERE
                tp.dat_usu_erase IS NULL AND
                tp.tipo_projeto_id <> 3
        )
    END AS pct
FROM
    tb_gates g
INNER JOIN tb_projetos p ON
    g.id = p.gate_id
WHERE
    p.dat_usu_erase IS NULL
GROUP BY
    g.gate;
    `);

    return query;
  }

  //retorna tipo de status por mês
  async getTotalProjetosGraficoMes() {
    const query: any[] = await this.prisma.$queryRawUnsafe(`
    select
    concat(substring(namemonth(extract(month from projetos.data_inicio)::int4) from 1 for 3), '/', to_char(projetos.data_inicio, 'YY')) as month,
    (
    select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '1. Não Iniciado'
    ) as nao_iniciados,
    (
    select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '5. Hold'
    ) as holds,
        (
    select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '2. Em análise'
    ) as em_analise,
        (
    select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '7. Concluído'
    ) as finalizados,
        (
    select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '8. Cancelado'
    ) as cancelados,
    (select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '6. Reprogramado'
    ) as reprogramado,
    (select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '3. Em andamento'
    ) as iniciados,
    (select count(status.id)::int
    FROM hmg.tb_projetos projs
      inner JOIN hmg.tb_status_projetos status ON status.id = projs.status_id
      WHERE (projs.tipo_projeto_id = ANY (ARRAY[1, 2])) AND projs.dat_usu_erase IS null
      and status.status =  '3. Pré Aprovação Diretor'
    ) as pre_aprovacao
from
tb_projetos projetos
where
    projetos.tipo_projeto_id <> 3
    and projetos.data_inicio is not null
group by 1
order by
    concat(substring(namemonth(extract(month from projetos.data_inicio)::int4) from 1 for 3), '/', to_char(projetos.data_inicio, 'YY')) desc;
    `);

    const result =
      query &&
      query.map((q) => ({
        mes: q.month.substring(0, 3),
        nao_iniciados: q.nao_iniciados,
        holds: q.holds,
        iniciados: q.iniciados,
        em_analise: q.em_analise,
        finalizados: q.finalizados,
        cancelados: q.cancelados,
        pre_aprovacao: q.pre_aprovacao,
        reprogramado: q.reprogramado,
        outros:
          q.nao_iniciados +
          q.em_analise +
          q.reprogramado +
          q.pre_aprovacao +
          q.holds,
      }));

    return result;
  }

  //retorna grafico de previsto x realizado
  async getPrevistoRealizadoBarras() {
    return await this.prisma.$queryRawUnsafe(`
    select 
    (
    (
    (
    select sum(valor_total_previsto) from tb_projetos tp 
    where tp.dat_usu_erase is null and tp.tipo_projeto_id <> 3 
    )
    /sum(capex_previsto)
    ) * 100
    ) tot_previsto_percent, 
    (
    case when sum(capex_realizado) > 0 then (sum(capex_previsto)/
    sum(capex_realizado)) * 100 else 0 end
    )
    as tot_realizado_percent,
    sum(capex_realizado) as tot_realizado,
    (
    select sum(valor_total_previsto) / 12 from tb_projetos tp 
    where tp.dat_usu_erase is null and tp.tipo_projeto_id <> 3 
    ) * count(mes) as tot_previsto_base_periodo
    from (
    select 
        concat(substring(namemonth(mes::int4) from 1 for 3), '/', ano) as mes,
        pct_capex_plan as capex_previsto,
        pct_capex_real as capex_realizado
      from (
          select 
            ano,
            mes,
            sum(vlr_plan) as pct_capex_plan,
            sum(vlr_real) as pct_capex_real
          from (    
            select 
               extract(year from dat_ini_plan) as ano,
               extract(month from dat_ini_plan) as mes,
               concat(extract(year from dat_ini_plan), extract(month from dat_ini_real)) as mesano,
               (
               select
               sum(projetos.valor_total_previsto)
               from tb_projetos projetos
               inner join tb_projetos_atividade topo
               on topo.id_projeto = projetos.id 
               inner join tb_projetos_atividade atividades
               on atividades.id_pai = topo.id
               where extract(year from atividades.dat_ini_plan) = extract(year from tpa.dat_ini_plan)
               and extract(month from atividades.dat_ini_plan) = extract(month from tpa.dat_ini_plan)
               and projetos.tipo_projeto_id <> 3
               and (topo.id_pai is null or topo.id_pai = 0)
               ) as vlr_plan,
               (
               select
               sum(centro_custo.valor_pago)
               from tb_projetos projetos
               inner join tb_projetos_atividade topo
               on topo.id_projeto = projetos.id 
               inner join tb_centro_custo centro_custo
               on centro_custo.projeto_id = projetos.id
               inner join tb_projetos_atividade atividades
               on atividades.id_pai = topo.id
               where extract(year from atividades.dat_ini_plan) = extract(year from tpa.dat_ini_plan)
               and extract(month from atividades.dat_ini_plan) = extract(month from tpa.dat_ini_plan)
               and projetos.tipo_projeto_id <> 3
               and (topo.id_pai is null or topo.id_pai = 0)
               ) as vlr_real
            from tb_projetos_atividade tpa 
            where dat_usu_erase is null
            and dat_ini_plan between '2022-01-01 00:00:00' and '2022-12-31 23:59:59' -- and id_projeto = 519
            union
            select 
               extract(year from dat_ini_plan) as ano,
               extract(month from dat_ini_plan) as mes,
                concat(extract(year from dat_ini_plan), extract(month from dat_ini_real)) as mesano,
               0 as vlr_plan,
               0 as vlr_real
            from tb_projetos_atividade tcac where dat_usu_erase is null -- and id_projeto = 519
            and dat_ini_plan between '2022-01-01 00:00:00' and '2022-12-31 23:59:59'
          ) as qr
        group by ano, mes
      ) as qr2
      group by qr2.mes, ano, pct_capex_plan, pct_capex_real
      order by qr2.mes, ano desc
     ) base
    `);
  }

  async getPrioridadeComplexidade() {
    const query: any[] = await this.prisma.$queryRawUnsafe(
      `
      select
      a.id,
      a.nome_projeto,
      responsavel,
      vlr_cr,
      vlr_orcado,
      case
        when vlr_orcado = 0 then 0
        else case
          when vlr_cr / vlr_orcado > 1 then 1
          else vlr_cr / vlr_orcado
        end
      end as vlr_tpci,
      (
      select
        opcoes.nom_opcao
      from
        tb_ranking ranking
      inner join tb_projetos_ranking projeto_ranking
        on
        projeto_ranking.id_ranking = ranking.id
      inner join tb_ranking_opcoes opcoes
        on
        opcoes.id = projeto_ranking.id_opcao
      where
        ranking.id = 4
        and projeto_ranking.id_projeto = a.id
        ) as prioridade,
      case
        when round(fn_cron_calc_pct_real_regra_aprovada(a.id), 0) > 100 then 100
        else round(fn_cron_calc_pct_real_regra_aprovada(a.id), 0)
      end as percent,
      case
        when vlr_orcado <= 300000 then
        'B'
        else 
           case
          when vlr_orcado between 300001 and 3000000 then
             'M'
          else 
             'A'
        end
      end as complexidade,
      polo_id,
      polo,
      coordenador,
      coordenador_id,
      (
      select
        case
          when 
          min(tpa.dat_ini_plan)
          is not null
          then
          min(tpa.dat_ini_plan)
          else coalesce(a.data_inicio, b.data_inicio)
        end
      from
        tb_projetos_atividade tpa
      where
        tpa.dat_usu_erase is null
        and tpa.id_pai = a.id
        ) as data_inicio,
      (
      select
        case
          when 
          max(tpa.dat_fim_plan)
          is not null
          then
          max(tpa.dat_fim_plan)
          else coalesce(a.data_fim, b.data_fim)
        end
      from
        tb_projetos_atividade tpa
      where
        tpa.dat_usu_erase is null
        and tpa.id_pai = a.id
        ) as data_fim,
      round((
        select case when sum(fn_cron_calc_pct_real_projeto(tpa.id, tp.id)) is null then 0 else sum(fn_cron_calc_pct_real_projeto(tpa.id, tp.id)) end from tb_projetos_atividade tpa
        inner join tb_projetos tp
        on tp.id = tpa.id_projeto
        where tp.id = a.id
        ), 2) as pct,
      coalesce(a.descricao, b.descricao) as descricao,
      coalesce(a.justificativa, b.justificativa) as justificativa,
      a.id as id_projeto_real,
      coalesce((
          select vlr_cpi from tb_projetos_spi_cpi
          where id_projeto = a.id
          ), 1) as vlr_cpi,
      coalesce((
          select vlr_spi from tb_projetos_spi_cpi
          where id_projeto = a.id
          ), 1) as vlr_spi,
      case
        when ranking is null then 0
        else ranking
      end as vlr_ranking
    from
      tb_projetos a
    left join (
      select
        aa.id_projeto,
        sum(bb.num_nota) as ranking
      from
        tb_projetos_ranking aa
      inner join tb_ranking_opcoes bb
          on
        aa.id_ranking = bb.id_ranking
        and aa.id_opcao = bb.id
      group by
        aa.id_projeto) as qr4
          on
      a.id = qr4.id_projeto
    left join (
      select
        id as id_projeto,
        trunc(case when coalesce(vlr_cr, 0) = 0 then 1 else vlr_va / vlr_cr end, 2) as vlr_cpi,
        trunc(case when coalesce(vlr_vp, 0) = 0 then 1 else vlr_va / vlr_vp end, 2) as vlr_spi,
        vlr_cr,
        valor_total_previsto as vlr_orcado,
        prioridade,
        complexidade,
        polo,
        coordenador_nome as coordenador,
        nome_responsavel as responsavel,
        data_inicio,
        data_fim,
        0 as pct,
        descricao,
        justificativa,
        nome_projeto
      from
        (
        select
          id,
          (fn_cron_calc_pct_plan_projeto(0,
          id)/ 100) * sum(vlr_planejado) as vlr_vp,
          (fn_cron_calc_pct_real_projeto(0,
          id)/ 100) * sum(vlr_planejado) as vlr_va,
          sum(vlr_realizado) as vlr_cr,
          valor_total_previsto,
          prioridade,
          complexidade,
          polo,
          coordenador_nome,
          nome_responsavel,
          data_inicio,
          data_fim,
          descricao,
          justificativa,
          nome_projeto
        from
          (
          select
            c.id,
            case
              when sum(c.valor_total_previsto) is null 
                      then 0
              else sum(valor_total_previsto)
            end as vlr_planejado,
            0 as vlr_realizado,
            c.valor_total_previsto,
            pri.prioridade,
            cpx.classificacao as complexidade,
            pls.polo,
            crd.coordenador_nome,
            rsp.nome_responsavel,
            c.data_inicio,
            c.data_fim,
            c.descricao,
            c.justificativa,
            c.nome_projeto
          from
            tb_projetos c
          left join tb_prioridades_projetos pri
                    on
            pri.id = c.prioridade_id
          left join tb_classificacoes_projetos cpx
                    on
            cpx.id = c.complexidade_id
          left join tb_polos pls
                    on
            pls.id = c.polo_id
          left join tb_coordenadores crd
                    on
            crd.id_coordenador = c.coordenador_id
          left join tb_responsaveis rsp
                    on
            rsp.responsavel_id = c.responsavel_id
          group by
            c.id,
            c.valor_total_previsto,
            pri.prioridade,
            cpx.classificacao,
            pls.polo,
            crd.coordenador_nome,
            rsp.nome_responsavel,
            c.data_inicio,
            c.data_fim,
            c.descricao,
            c.justificativa,
            c.nome_projeto
        union
          select
            c.id,
            0 as vlr_planejado,
            case
              when sum(valor) is null 
                      then 0
              else sum(valor)
            end as vlr_realizado,
            c.valor_total_previsto,
            pri.prioridade,
            cpx.classificacao as complexidade,
            pls.polo,
            crd.coordenador_nome,
            rsp.nome_responsavel,
            c.data_inicio,
            c.data_fim,
            c.descricao,
            c.justificativa,
            c.nome_projeto
          from
            tb_centro_custo a
          inner join tb_projetos c
                    on
            a.projeto_id = c.id
          left join tb_prioridades_projetos pri
                    on
            pri.id = c.prioridade_id
          left join tb_classificacoes_projetos cpx
                    on
            cpx.id = c.complexidade_id
          left join tb_polos pls
                    on
            pls.id = c.polo_id
          left join tb_coordenadores crd
                    on
            crd.id_coordenador = c.coordenador_id
          left join tb_responsaveis rsp
                    on
            rsp.responsavel_id = c.responsavel_id
          group by
            c.id,
            c.valor_total_previsto,
            pri.prioridade,
            cpx.classificacao,
            pls.polo,
            crd.coordenador_nome,
            rsp.nome_responsavel,
            c.data_inicio,
            c.data_fim,
            c.descricao,
            c.justificativa,
            c.nome_projeto
                ) as qr
        group by
          qr.id,
          qr.valor_total_previsto,
          qr.prioridade,
          qr.complexidade,
          qr.polo,
          qr.coordenador_nome,
          qr.nome_responsavel,
          qr.data_inicio,
          qr.data_fim,
          qr.descricao,
          qr.justificativa,
          qr.nome_projeto
                ) as qr2
          ) as b
          on
      a.id = b.id_projeto
    where
      a.tipo_projeto_id in (1, 2)
      and a.dat_usu_erase is null
    order by
      vlr_ranking desc; 
      `,
    );

    const prioridadeComplexidade =
      query &&
      query.map((element) => ({
        prioridade: element.prioridade,
        complexidade: element.complexidade,
      }));

    function getPrioridadeComplexidadeCounts(items: any[]) {
      const counts = {
        prioridade: {
          Alto: 0,
          Médio: 0,
          Baixo: 0,
        },
        complexidade: {
          A: 0,
          M: 0,
          B: 0,
        },
      };

      for (const item of items) {
        const { prioridade, complexidade } = item;
        counts.prioridade[prioridade]++;
        counts.complexidade[complexidade]++;
      }

      return counts;
    }

    return getPrioridadeComplexidadeCounts(prioridadeComplexidade);
  }

  async getTotalProjetosSGrafico() {
    const retornoQuery: QueryTotalProjetosDto[] = await this.prisma
      .$queryRaw`SELECT * FROM v_dash_total_projetos_s_grafico`;

    const projetosPorStatus = retornoQuery.map(({ id, status, qtd }) => ({
      id,
      status,
      qtd,
    }));

    const totalProjetos = retornoQuery[0]?.total | 0;

    const prioridades: PrioridadesProjetoDto = {
      alta: retornoQuery[0]?.prioridades_alta | 0,
      media: retornoQuery[0]?.prioridades_media | 0,
      baixa: retornoQuery[0]?.prioridades_baixa | 0,
      nula: retornoQuery[0]?.prioridades_nula | 0,
    };

    const complexidades: ComplexidadesProjetoDto = {
      alta: retornoQuery[0]?.complexidades_alta | 0,
      media: retornoQuery[0]?.complexidades_media | 0,
      baixa: retornoQuery[0]?.complexidades_baixa | 0,
      nula: retornoQuery[0]?.complexidades_nula | 0,
    };

    const retornoApi: TotalProjetosDto = {
      projetosPorStatus,
      totalProjetos,
      prioridades,
      complexidades,
    };

    return retornoApi;
  }

  async getAreasDemandadas() {
    const retornoQuery: QueryAreasDemandadasDto = await this.prisma
      .$queryRaw(Prisma.sql`
      SELECT * FROM v_dash_areas_demandadas
    `);
    return retornoQuery;
  }

  async getSolicitantes() {
    const retornoQuery: any = await this.prisma.$queryRaw(Prisma.sql`
    SELECT
    b.solicitante AS solicitante,
    concat(substring(namemonth(extract(month from qr.data_inicio)::int4) from 1 for 3), '/', to_char(qr.data_inicio, 'YY')) as data,
    COUNT(b.id)::integer AS quantia
FROM
    tb_projetos a
inner join
    tb_solicitantes_projetos b ON a.solicitante_id = b.id
inner join
(
select pai.id_projeto, min(filho.dat_ini_real) as data_inicio
from
	tb_projetos_atividade pai
inner join
	tb_projetos_atividade filho on filho.id_pai = pai.id
where 
    (pai.id_pai = 0 or pai.id_pai is null)
    and pai.dat_usu_erase is null
    and filho.dat_usu_erase is null
group by 1
) qr on qr.id_projeto = a.id
WHERE
    qr.data_inicio > date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
    AND date_trunc('month', qr.data_inicio) <= date_trunc('month', CURRENT_DATE)
    AND a.dat_usu_erase IS NULL
    AND a.tipo_projeto_id <> 3
GROUP BY
    1, 2;
    `);

    return retornoQuery;
  }

  async getTotalOrcamentoPrevisto() {
    const retornoQuery: TotalOrcamentoDto[] = await this.prisma
      .$queryRaw`select 
        coalesce(sum(valor_total_previsto), 0) as vlr_orcamento_total
      from tb_projetos tp 
      where tipo_projeto_id in (1,2) and  tp.dat_usu_erase IS NULL `;

    return retornoQuery.map((orc) => ({
      total: orc.vlr_orcamento_total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      }),
    }));
  }

  async getTotalRealizado() {
    const retornoQuery: TotalRealizadoDto[] = await this.prisma
      .$queryRaw`     select sum(valor) as vlr_realizado from tb_centro_custo centro_custo
      inner join tb_projetos projetos
      on projetos.id = centro_custo.projeto_id
    where projetos.tipo_projeto_id in (1, 2) and projetos.dat_usu_erase is null;`;

    return retornoQuery.map((tot) => ({
      totalRealizado: Number(tot.vlr_realizado),
    }));
  }

  async getTotalNaoPrevisto() {
    const retornoQuery: TotalNaoPrevistoDto[] = await this.prisma
      .$queryRaw`select case when sum(vlr_nao_prev) <= 0  then 0 else sum(vlr_nao_prev) end as vlr_nao_prev,  sum(vlr_nao_prev)
      from (
          select 
              case when sum(vlr_planejado) is null 
                  then 0 
                  else sum(vlr_planejado)*-1
              end as vlr_nao_prev
          from tb_projetos_atividade_custo_plan a
          inner join tb_projetos_atividade b
              on a.id_atividade = b.id
          inner join tb_projetos c
              on b.id_projeto = c.id
          where c.tipo_projeto_id in (1,2)
          union
          select 
              case when sum(vlr_realizado) is null 
                  then 0 
                  else sum(vlr_realizado)
              end as vlr_nao_prev
          from tb_projetos_atividade_custo_real a
          inner join tb_projetos_atividade b
              on a.id_atividade = b.id
          inner join tb_projetos c
              on b.id_projeto = c.id
          where c.tipo_projeto_id in (1,2)
      ) as qr;`;

    return retornoQuery.map((tot) => ({
      totalNaoPrevisto: Number(tot.vlr_nao_prev),
    }));
  }

  async getInfoProjetos() {
    const retornoQuery = await this.prisma.projeto.findMany({
      select: {
        id: true,
        nomeProjeto: true,
        valorTotalPrevisto: true,
        prioridadeProjeto: true,
        complexidade: true,
        responsavel: true,
        dataInicio: true,
        dataFim: true,
        coordenador: true,
        poloId: true,
        descricao: true,
        justificativa: true,
      },
    });
    const info = retornoQuery.map((query) => {
      return {
        id: query.id,
        nome: query.nomeProjeto,
        valorTotalPrevisto: query.valorTotalPrevisto,
        prioridade: query.prioridadeProjeto
          ? query.prioridadeProjeto.prioridade
          : null,
        complexidade: query.complexidade
          ? query.complexidade.complexidade
          : null,
        responsavel: query.responsavel ? query.responsavel.nome : null,
        coordenador: query.coordenador
          ? query.coordenador.coordenadorNome
          : null,
        dataInicio: query.dataInicio ? query.dataInicio : null,
        dataFim: query.dataFim ? query.dataFim : null,
        polo: query.poloId,
        descricao: query.descricao,
        justificativa: query.justificativa,
      };
    });
    return info;
  }

  async getInfoProjetosAlagoas() {
    const retornoQuery = await this.prisma.projeto.findMany({
      select: {
        id: true,
        nomeProjeto: true,
        valorTotalPrevisto: true,
        prioridadeProjeto: true,
        complexidade: true,
        responsavel: true,
        coordenador: true,
      },
      where: {
        poloId: 1,
      },
    });
    const info = retornoQuery.map((query) => {
      return {
        id: query.id,
        nome: query.nomeProjeto,
        valorTotalPrevisto: query.valorTotalPrevisto,
        prioridade: query.prioridadeProjeto
          ? query.prioridadeProjeto.prioridade
          : null,
        complexidade: query.complexidade
          ? query.complexidade.complexidade
          : null,
        responsavel: query.responsavel ? query.responsavel.nome : null,
        coordenador: query.coordenador
          ? query.coordenador.coordenadorNome
          : null,
      };
    });
    return info;
  }

  async getInfoProjetosTucanoSul() {
    const retornoQuery = await this.prisma.projeto.findMany({
      select: {
        id: true,
        nomeProjeto: true,
        valorTotalPrevisto: true,
        prioridadeProjeto: true,
        complexidade: true,
        responsavel: true,
        coordenador: true,
      },
      where: {
        poloId: 2,
      },
    });
    const info = retornoQuery.map((query) => {
      return {
        id: query.id,
        nome: query.nomeProjeto,
        valorTotalPrevisto: query.valorTotalPrevisto,
        prioridade: query.prioridadeProjeto
          ? query.prioridadeProjeto.prioridade
          : null,
        complexidade: query.complexidade
          ? query.complexidade.complexidade
          : null,
        responsavel: query.responsavel ? query.responsavel.nome : null,
        coordenador: query.coordenador
          ? query.coordenador.coordenadorNome
          : null,
      };
    });
    return info;
  }
}
