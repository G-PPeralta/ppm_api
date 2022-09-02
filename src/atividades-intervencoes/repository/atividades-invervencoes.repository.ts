import { Injectable } from '@nestjs/common';
import { AtividadesIntervencaoEntity } from 'atividades-intervencoes/entities/atividades-intervencao.entity';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class AtividadeIntervencaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<AtividadesIntervencaoEntity> {
    return await this.prisma.atividadeIntervencao.findFirstOrThrow({
      where: { id },
    });
  }

  async save(atividade: AtividadesIntervencaoEntity) {
    return await this.prisma.atividadeIntervencao.create({ data: atividade });
  }
}
