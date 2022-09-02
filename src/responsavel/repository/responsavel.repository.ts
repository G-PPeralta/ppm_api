import { Injectable } from '@nestjs/common';
import { ResponsavelEntity } from '../entities/responsavel.entity';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class ResponsavelRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<ResponsavelEntity> {
    return await this.prisma.responsavel.findFirstOrThrow({ where: { id } });
  }
}
