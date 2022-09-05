import { Injectable } from '@nestjs/common';
import { IntervencoesTipoEntity } from '../entities/intervencoes-tipo.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SaveIntervencaoTipoDto } from '../dto/save-intervencoes-tipo.dto';

@Injectable()
export class IntervencaoTipoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<IntervencoesTipoEntity> {
    return await this.prisma.intervencaoTipo.findFirstOrThrow({
      where: { id },
    });
  }

  async save(atividade: SaveIntervencaoTipoDto) {
    return await this.prisma.intervencaoTipo.create({ data: atividade });
  }

  async IntervencoesTiposList() {
    return await this.prisma.intervencaoTipo.findMany({
      select: { id: true, nome: true },
    });
  }
}
