/**
 * CRIADO EM: 20/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: serviço que cria, lista e atualiza as opções do ranking. Ranking determina a ordem de prioridade de um projeto. Projetos prioritários aparecerão em primeiro na listagem que existe no front-end
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateRankingOpcoesDto } from './dto/create-ranking-opcoes.dto';

@Injectable()
export class RankingsOpcoesService {
  constructor(private prisma: PrismaService) {}

  async create(createRankingOpcoes: CreateRankingOpcoesDto) {
    const id = await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_ranking_opcoes
    (id_ranking, num_opcao, nom_opcao, num_nota, nom_usu_create, dat_usu_create)
    VALUES(${createRankingOpcoes.id_ranking}, 
    (SELECT COUNT(NUM_OPCAO) + 1 FROM tb_ranking_opcoes WHERE id_ranking = ${createRankingOpcoes.id_ranking})  
    , '${createRankingOpcoes.nom_opcao}', ${createRankingOpcoes.num_nota}, '${createRankingOpcoes.nom_usu_create}', NOW())
    returning id
    `);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id, tro.num_nota  from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id where tr.dat_usu_erase is null
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id, tro.num_nota  from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id WHERE tro.id_ranking = ${id} and tro.dat_usu_erase is null
    `);
  }

  async update(id: number, campo: string, valor: string, user: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_ranking_opcoes where id = ${id};
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_ranking_opcoes SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      },
      nom_usu_edit = '${user}',
      dat_usu_edit = now()
      where id = ${id}`);
    }
  }

  async remove(id: number, user: string) {
    await this.prisma.$queryRawUnsafe(`
        update tb_ranking_opcoes SET
            dat_usu_erase = now(),
            nom_usu_erase = '${user}'
        where id = ${id}
    `);
  }
}
