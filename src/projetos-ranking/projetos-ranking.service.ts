import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosRankingDto } from './dto/create-projetos-ranking.dto';

@Injectable()
export class ProjetosRankingService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetosRankingDto: CreateProjetosRankingDto) {
    const id = await this.prisma.$queryRawUnsafe(`
    INSERT INTO dev.tb_projetos_ranking
    (id_projeto, id_ranking, id_opcao, dsc_comentario, nom_usu_create, dat_usu_create)
    VALUES(${createProjetosRankingDto.id_projeto}, ${createProjetosRankingDto.id_ranking}, ${createProjetosRankingDto.id_opcao}, '${createProjetosRankingDto.dsc_comentario}', '${createProjetosRankingDto.nom_usu_create}', NOW());
    returning id_projeto
    `);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id  from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id 
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id  from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id 
    inner join tb_projetos_ranking tpr 
    on tpr.id_opcao = tro.num_opcao  and tpr.id_ranking  = tr.id
    where tpr.id_projeto = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string, user: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_projetos_ranking where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_projetos_ranking SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      },
      nom_usu_edit = '${user}',
      dat_usu_edit = now()
      where id = ${id}`);
    }
  }

  async remove(id: number, user: string) {
    await this.prisma.$queryRawUnsafe(`
        update tb_projetos_ranking SET
            dat_usu_erase = now(),
            nom_usu_erase = '${user}'
        where id = ${id}
    `);
  }
}
