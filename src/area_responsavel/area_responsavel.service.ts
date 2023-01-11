import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAreaResponsavel } from './dto/create-responsavel.dto';

@Injectable()
export class AreaResponsavelService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_responsavel_atv_projeto
    `);
  }

  async createArea(area: CreateAreaResponsavel) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_responsavel_atv_projeto (nom_responsavel, id_classe, num_peso) values('${area.nom_responsavel}', 4, 0)
      on conflict (nom_responsavel)
      do update set nom_responsavel = '${area.nom_responsavel}', dat_usu_erase = null;
    `);
  }
}
