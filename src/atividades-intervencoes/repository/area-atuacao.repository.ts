import { Injectable } from '@nestjs/common';
import { AtividadesIntervencaoEntity } from 'atividades-intervencoes/entities/atividades-intervencao.entity';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AreaAtuacaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<AtividadesIntervencaoEntity> {
    return this.prisma.atividadeIntervencao.findFirstOrThrow({ where: { id } });
  }
}
