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

    // const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    // const demandas = retornoQuery.map((project) => ({
    //   data:
    //     Number(project.dataInicio && project.dataInicio.getMonth()) <=
    //       Number(currentMonth) &&
    //     Number(project.dataInicio && project.dataInicio.getMonth()) >=
    //       Number(currentMonth) - 4,
    //   sms: retornoQuery.filter((project) => project.solicitanteId == 5).length,
    //   regulatorio: retornoQuery.filter((project) => project.solicitanteId == 8)
    //     .length,
    //   operacao: retornoQuery.filter((project) => project.solicitanteId == 2)
    //     .length,
    //   outros: retornoQuery.filter(
    //     (project) =>
    //       project.solicitanteId !== 5 &&
    //       project.solicitanteId !== 8 &&
    //       project.solicitanteId !== 2,
    //   ).length,
    // }));

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

    return demandas;
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
      .$queryRaw`select max(valor_total_previsto) as vlr_orcamento_total
      from dev.tb_projetos tp 
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
