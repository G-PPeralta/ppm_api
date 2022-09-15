import { Injectable } from '@nestjs/common';
import { SaveProjetoIntervencaoDTO } from 'projeto-intervencao/dto/save-projeto-intervencao.dto';
import { ProjetoIntervencaoEntity } from 'projeto-intervencao/entities/projeto-intervencao.entity';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class ProjetoIntervencaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<ProjetoIntervencaoEntity> {
    return await this.prisma.intervencaoProjetoTipo.findFirstOrThrow({
      where: { id },
    });
  }

  async save(atividade: SaveProjetoIntervencaoDTO) {
    return await this.prisma.intervencaoProjetoTipo.create({ data: atividade });
  }

  async projetoList() {
    return await this.prisma.intervencaoProjetoTipo.findMany({
      select: {
        id: true,
        nome: true,
        atividades: {
          select: {
            atividade: true,
          },
        },
      },
    });
  }
}
