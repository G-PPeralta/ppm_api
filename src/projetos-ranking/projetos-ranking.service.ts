import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class ProjetosRankingService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id  from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id 
    `);
  }
}
