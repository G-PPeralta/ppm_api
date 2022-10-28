import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class ClasseServicoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`SELECT * FROM tb_classe_servico`);
  }
}
