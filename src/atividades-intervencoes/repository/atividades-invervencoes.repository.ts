import { Injectable } from '@nestjs/common';
import { SaveAtividadesIntervencoeDto } from 'atividades-intervencoes/dto/save-atividades-intervencoes-dto';
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

  async save(atividade: SaveAtividadesIntervencoeDto) {
    return await this.prisma.atividadeIntervencao.create({ data: atividade });
  }

  async atividadesist() {
    return await this.prisma.atividadeIntervencao.findMany({
      select: { id: true, nome: true },
    });
  }
}
