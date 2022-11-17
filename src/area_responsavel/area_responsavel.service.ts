import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AreaResponsavelService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_responsavel_atv_projeto
    `);
  }
}
