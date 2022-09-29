import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class OperacaoIntervencaoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma
      .$queryRawUnsafe(`select * from dev.tb_operacao_intervencao where nom_usu_erase is null;
    `);
  }
}
