import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { QueryAreasDemandadasDto } from './dto/areas-demandadas-projetos.dto';
import { ProjetoDto } from './dto/projetos.dto';
import { TotalNaoPrevistoDto } from './dto/total-nao-previsto.dto';
import {
  TotalOrcamentoDto,
  // TransformNumberDto,
} from './dto/total-orcamento.dto';
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
    const retorno: any[] = await this.prisma.$queryRaw`
    select gates.gate as name, count(projetos.gate_id)::integer as value from tb_gates gates
    inner join tb_projetos projetos
    on gates.id = projetos.gate_id
    where tipo_projeto_id <> 3
    group by gates.gate
    union 
    select gate as name, 0 as value from tb_gates
    where gate not in (
      select gates.gate from
      tb_gates gates
      inner join tb_projetos projetos
      on projetos.gate_id = gates.id
      where projetos.tipo_projeto_id <> 3
    )
    `;

    let sum = 0;
    retorno.forEach((e) => {
      sum += e.value;
    });

    return retorno.map((e) => {
      return {
        name: e.name,
        value: Number((e.value > 0 ? e.value / sum : e.value) * 100),
      };
    });
  }

  async getTotalProjetosGraficoMes() {
    return await this.prisma.$queryRawUnsafe(`
    select
    concat(substring(namemonth(extract(month from projetos.data_inicio)::int4) from 1 for 3), '/', to_char(projetos.data_inicio, 'YY')) as month,
    (count(status.id) filter (where status.id = 1))::int4 as nao_iniciados,
    (count(status.id) filter (where status.id = 2))::int4 as holds,
    (count(status.id) filter (where status.id = 3))::int4 as iniciados,
    (count(status.id) filter (where status.id = 4))::int4 as em_analise,
    (count(status.id) filter (where status.id = 5))::int4 as finalizados,
    (count(status.id) filter (where status.id = 6))::int4 as cancelados,
    (count(status.id) filter (where status.id = 7))::int4 as pre_aprovacao,
    (count(status.id) filter (where status.id = 8))::int4 as reprogramado
    from dev.tb_status_projetos status
    inner join tb_projetos projetos
    on projetos.status_id = status.id
    where
    projetos.tipo_projeto_id <> 3
    group by
    concat(substring(namemonth(extract(month from projetos.data_inicio)::int4) from 1 for 3), '/', to_char(projetos.data_inicio, 'YY'))
    `);
  }

  async getTotalProjetosSGrafico() {
    const retornoQuery: QueryTotalProjetosDto[] = await this.prisma
      .$queryRaw`SELECT * FROM v_dash_total_projetos_s_grafico`;
    const projetosPorStatus = retornoQuery.map(({ id, status, qtd }) => ({
      id,
      status,
      qtd,
    }));

    const totalProjetos = retornoQuery[0].total;

    const prioridades: PrioridadesProjetoDto = {
      alta: retornoQuery[0].prioridades_alta,
      media: retornoQuery[0].prioridades_media,
      baixa: retornoQuery[0].prioridades_baixa,
      nula: retornoQuery[0].prioridades_nula,
    };

    const complexidades: ComplexidadesProjetoDto = {
      alta: retornoQuery[0].complexidades_alta,
      media: retornoQuery[0].complexidades_media,
      baixa: retornoQuery[0].complexidades_baixa,
      nula: retornoQuery[0].complexidades_nula,
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
    b.solicitante as solicitante,
    to_char(a.data_inicio, 'YYYY-MM') as data,
    count(b.id) as quantia
FROM tb_projetos a
JOIN tb_solicitantes_projetos b ON a.solicitante_id = b.id
WHERE a.data_inicio >
   date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
   and date_trunc('month', a.data_inicio) <= date_trunc('month', CURRENT_DATE)
GROUP BY 1, 2;
    `);

    const demandas = retornoQuery.map((deman) => ({
      month: Number(deman.data.split('-')[1]),
      sms: deman.solicitante == 'SMS' ? Number(deman.quantia) : 0,
      regulatorio:
        deman.solicitante == 'Regulatório' ? Number(deman.quantia) : 0,
      operacao: deman.solicitante == 'Operação' ? Number(deman.quantia) : 0,
      outros:
        deman.solicitante !== 'Operação' &&
        deman.solicitante !== 'SMS' &&
        deman.solicitante !== 'Regulatório'
          ? Number(deman.quantia)
          : 0,
    }));

    const demandasCompletas = demandas.reduce((acc, curr) => {
      const index = acc.findIndex((item) => item.month === curr.month);
      if (index === -1) {
        acc.push(curr);
      } else {
        acc[index].sms += curr.sms;
        acc[index].regulatorio += curr.regulatorio;
        acc[index].operacao += curr.operacao;
        acc[index].outros += curr.outros;
      }
      return acc;
    }, []);

    return demandasCompletas;
  }

  // async getTotalOrcamentoPrevisto(poloId?: number) {
  //   const retornoQuery: TotalOrcamentoDto[] = await this.prisma
  //     .$queryRaw`select * from f_orcado_realizado_polo_id(${Prisma.sql`${
  //     poloId ? poloId : null
  //   }`})`;

  //   const tranformTotalInNumber: TransformNumberDto[] = retornoQuery.map(
  //     ({ total, tipo_valor }) => ({
  //       total: Number(total),
  //       tipo_valor,
  //     }),
  //   );

  //   return tranformTotalInNumber;
  // }

  async getTotalOrcamentoPrevisto() {
    const retornoQuery: TotalOrcamentoDto[] = await this.prisma
      .$queryRaw`select coalesce(sum(valor_total_previsto), 0) as vlr_orcamento_total
      from tb_projetos tp 
      where tipo_projeto_id in (1,2)`;

    return retornoQuery.map((orc) => ({
      total: Number(orc.vlr_orcamento_total),
    }));
  }

  async getTotalRealizado() {
    const retornoQuery: TotalRealizadoDto[] = await this.prisma
      .$queryRaw`select 
      case when max(vlr_realizado) is null 
          then 0 
          else max(vlr_realizado)
      end as vlr_realizado
  from dev.tb_projetos_atividade_custo_real a
  inner join dev.tb_projetos_atividade b
      on a.id_atividade = b.id
  inner join dev.tb_projetos c
      on b.id_projeto = c.id
  where c.tipo_projeto_id in (1,2);`;

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
          from dev.tb_projetos_atividade_custo_plan a
          inner join dev.tb_projetos_atividade b
              on a.id_atividade = b.id
          inner join dev.tb_projetos c
              on b.id_projeto = c.id
          --where c.tipo_projeto_id in (1,2)
          union
          select 
              case when sum(vlr_realizado) is null 
                  then 0 
                  else sum(vlr_realizado)
              end as vlr_nao_prev
          from dev.tb_projetos_atividade_custo_real a
          inner join dev.tb_projetos_atividade b
              on a.id_atividade = b.id
          inner join dev.tb_projetos c
              on b.id_projeto = c.id
          --where c.tipo_projeto_id in (1,2)
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
