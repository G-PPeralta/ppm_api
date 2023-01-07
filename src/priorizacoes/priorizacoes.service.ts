import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PriorizacoesDto } from './dto/priorizacoes.dto';

@Injectable()
export class PriorizacoesService {
  constructor(private prismaClient: PrismaService) {}

  async getPriorizacoes() {
    return await this.prismaClient.$queryRawUnsafe(
      'SELECT id_projeto, prioridade FROM tb_priorizacao_projetos',
    );
  }

  async insertPriorizacoes(priorizacoes: PriorizacoesDto[]) {
    for (const p of priorizacoes) {
      await this.prismaClient.$queryRawUnsafe(
        `INSERT INTO tb_priorizacao_projetos (id_projeto, prioridade) VALUES (${p.id_projeto}, ${p.prioridade})`,
      );
    }
  }
}
