import { Injectable } from '@nestjs/common';
import { AreaAtuacaoEntity } from '../entities/area-atuacao.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateAreaAtuacaoDto } from 'area-atuacao/dto/create-area-atuacao.dto';

@Injectable()
export class AreaAtuacaoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<AreaAtuacaoEntity> {
    return await this.prisma.areaAtuacao.findFirstOrThrow({ where: { id } });
  }

  async getAll() {
    return await this.prisma.areaAtuacao.findMany();
  }

  async save(area: CreateAreaAtuacaoDto) {
    return await this.prisma.areaAtuacao.create({ data: area });
  }
}
