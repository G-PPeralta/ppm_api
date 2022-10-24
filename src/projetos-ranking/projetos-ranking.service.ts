import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosRankingDto } from './dto/create-projetos-ranking.dto';

@Injectable()
export class ProjetosRankingService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetosRankingDto: CreateProjetosRankingDto) {
    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.beneficio.id_ranking,
      createProjetosRankingDto.beneficio.opcao_id,
    );

    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.complexidade.id_ranking,
      createProjetosRankingDto.complexidade.opcao_id,
    );

    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.estrategia.id_ranking,
      createProjetosRankingDto.estrategia.opcao_id,
    );

    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.operacao.id_ranking,
      createProjetosRankingDto.operacao.opcao_id,
    );

    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.prioridade.id_ranking,
      createProjetosRankingDto.prioridade.opcao_id,
    );

    await this.prepareInsert(
      createProjetosRankingDto,
      createProjetosRankingDto.regulatorio.id_ranking,
      createProjetosRankingDto.regulatorio.opcao_id,
    );
  }

  async prepareInsert(
    createProjetosRankingDto: CreateProjetosRankingDto,
    id_ranking,
    id_opcao,
  ) {
    await this.insertQuery(
      createProjetosRankingDto.id_projeto,
      id_ranking,
      id_opcao,
      createProjetosRankingDto.dsc_comentario,
      createProjetosRankingDto.nom_usu_create,
    );
  }

  async insertQuery(
    id_projeto,
    id_ranking,
    id_opcao,
    dsc_comentario,
    nom_usu_create,
  ) {
    await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_ranking (id_projeto, id_ranking, id_opcao, dsc_comentario, nom_usu_create, dat_usu_create)
      VALUES (${id_projeto}, ${id_ranking}, ${id_opcao}, ${
      dsc_comentario === null ? null : "'" + dsc_comentario + "'"
    }, '${nom_usu_create}', now())
    ON CONFLICT (id_projeto, id_ranking)
    DO UPDATE SET
      id_opcao = ${id_opcao}
    WHERE
      tb_projetos_ranking.id_projeto = ${id_projeto} AND
      tb_projetos_ranking.id_ranking = ${id_ranking}
    `);
  }

  async findAll() {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select tr.nom_ranking, tr.id, tro.nom_opcao, tro.id as opcao_id from 
    tb_ranking tr
    inner join tb_ranking_opcoes tro 
    on tro.id_ranking = tr.id 
    `);

    const tratamento = {};

    for (const { nom_ranking, id, nom_opcao, opcao_id } of retorno) {
      if (!tratamento[nom_ranking]) tratamento[nom_ranking] = [];
      tratamento[nom_ranking].push({ id, nom_opcao, opcao_id });
    }

    return tratamento;
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    select * from tb_projetos_ranking
    where id_projeto = ${id}
    `);
  }

  async findProjetos() {
    return await this.prisma.$queryRawUnsafe(`
    select a.*, case when num_ranking is null then 0 else num_ranking end as num_ranking 
from tb_projetos a
left join (
        select tp.id as id_projeto, sum(tro.num_nota) as num_ranking
        from tb_projetos tp 
        inner join tb_projetos_ranking tpr 
            on tp.id = tpr.id_projeto 
        inner join tb_ranking_opcoes tro 
            on  tpr.id_opcao = tro.id 
        group by tp.id
    ) b
    on a.id = b.id_projeto
where 
    a.tipo_projeto_id in (1,2,4)
order by b.num_ranking asc;
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
