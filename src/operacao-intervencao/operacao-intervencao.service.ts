import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class OperacaoIntervencaoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma
      .$queryRawUnsafe(`select * from tb_operacao_intervencao where dat_usu_erase is null;
    `);
  }

  delete(id: number) {
    return this.prisma.$queryRawUnsafe(`
   UPDATE tb_operacao_intervencao set dat_usu_erase = now()
    WHERE id = ${id};
   `);
  }
}
