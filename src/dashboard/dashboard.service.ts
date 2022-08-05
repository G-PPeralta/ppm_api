import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { QueryAreasDemandadasDto } from './dto/areas-demandadas-projetos.dto';
import {
  TotalOrcamentoDto,
  TransformNumberDto,
} from './dto/total-orcamento.dto';
import {
  ComplexidadesProjetoDto,
  PrioridadesProjetoDto,
  QueryTotalProjetosDto,
  TotalProjetosDto,
} from './dto/total-projetos.dto';

@Injectable()
export class DashboardService {
  static errors = {
    totalOrcamento: {
      badRequestError: 'Query string param polo_id_param is not a number',
    },
  };
  async getTotalProjetosSGrafico() {
    const retornoQuery: QueryTotalProjetosDto[] =
      await prismaClient.$queryRaw`SELECT * FROM v_dash_total_projetos_s_grafico`;
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
    const retornoQuery: QueryAreasDemandadasDto =
      await prismaClient.$queryRaw(Prisma.sql`
      SELECT * FROM v_dash_areas_demandadas
    `);
    return retornoQuery;
  }

  async getTotalOrcamentoPrevisto(poloId?: number) {
    const retornoQuery: TotalOrcamentoDto[] =
      await prismaClient.$queryRaw`select * from f_orcado_realizado_polo_id(${Prisma.sql`${
        poloId ? poloId : null
      }`})`;

    const tranformTotalInNumber: TransformNumberDto[] = retornoQuery.map(
      ({ total, tipo_valor }) => ({
        total: Number(total),
        tipo_valor,
      }),
    );

    return tranformTotalInNumber;
  }

  async getInfoProjetos() {
    const retornoQuery = await prismaClient.projeto.findMany({
      select: {
        id: true,
        nomeProjeto: true,
        valorTotalPrevisto: true,
      },
    });
    return retornoQuery;
  }
}
