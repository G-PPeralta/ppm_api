import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { QueryAreasDemandadasDto } from './dto/areas-demandadas-projetos.dto';
import {
  ComplexidadesProjetoDto,
  PrioridadesProjetoDto,
  QueryTotalProjetosDto,
  TotalProjetosDto,
} from './dto/total-projetos.dto';

@Injectable()
export class DashboardService {
  async getTotalProjetosSGrafico() {
    const retornoQuery: QueryTotalProjetosDto[] = await prismaClient.$queryRaw(
      Prisma.sql`SELECT * FROM ${process.env.DATABASE_SCHEMA}.v_dash_total_projetos_s_grafico`,
    );

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
      SELECT * FROM ${process.env.DATABASE_SCHEMA}.v_dash_areas_demandadas
    `);
    return retornoQuery;
  }

  async getTotalOrcamentoPrevisto() {
    const retornoQuery = await prismaClient.$queryRaw(Prisma.sql`
      select sum(projs.valor_total_previsto)::numeric(22,2) total_orcamento from ${process.env.DATABASE_SCHEMA}.tb_projetos projs;
    `);

    return { totalOrcamento: parseFloat(retornoQuery[0].total_orcamento) };
  }
}
