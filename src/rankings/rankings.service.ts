import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateRankingDto } from './dto/create-ranking.dto';

@Injectable()
export class RankingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRanking: CreateRankingDto) {
    const id = await this.prisma.$queryRawUnsafe(`
    INSERT INTO dev.tb_ranking
    (id_area_responsavel, nom_ranking, num_peso, nom_usu_create, dat_usu_create)
    VALUES(${createRanking.id_area_responsavel}, '${createRanking.nom_ranking}', ${createRanking.num_peso}, '${createRanking.nom_usu_create}', now());
    returning id
    `);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_ranking
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        SELECT * FROM tb_ranking WHERE id = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string, user: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_ranking where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_ranking SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      },
      nom_usu_edit = '${user}',
      dat_usu_edit = now()
      where id = ${id}`);
    }
  }

  async remove(id: number, user: string) {
    await this.prisma.$queryRawUnsafe(`
        update tb_ranking SET
            dat_usu_erase = now(),
            nom_usu_erase = '${user}'
        where id = ${id}
    `);
  }
}
