import { Injectable } from '@nestjs/common';
import { IntervencaoEntity } from '../entities/intervencao.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SaveIntervencaoDto } from '../dto/save-intervencao.dto';

@Injectable()
export class IntervencaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<IntervencaoEntity> {
    return await this.prisma.intervencao.findFirstOrThrow({
      where: { id },
    });
  }

  async save(intervencao: SaveIntervencaoDto) {
    return await this.prisma.intervencao.create({ data: intervencao });
  }

  async intervencoesList() {
    return await this.prisma.intervencao.findMany();
  }
}
