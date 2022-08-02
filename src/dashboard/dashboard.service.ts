import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import {
  QueryTotalProjetosDto,
  TotalProjetosDto,
} from './dto/total-projetos.dto';

@Injectable()
export class DashboardService {
  async getTotalProjetosSGrafico() {
    const retornoQuery: QueryTotalProjetosDto[] = await prismaClient.$queryRaw(
      Prisma.sql`SELECT * FROM dev.v_dash_total_projetos_s_grafico`,
    );
    const projetosPorStatus = retornoQuery.map(({ id, status, qtd }) => ({
      id,
      status,
      qtd,
    }));

    const totalProjetos = retornoQuery[0].total;

    const prioridades = {
      alta: retornoQuery[0].prioridades_alta,
      media: retornoQuery[0].prioridades_media,
      baixa: retornoQuery[0].prioridades_baixa,
      nula: retornoQuery[0].prioridades_nula,
    };

    const retornoApi: TotalProjetosDto = {
      projetosPorStatus,
      totalProjetos,
      prioridades,
    };

    return retornoApi;
  }
}
