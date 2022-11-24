import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateCampanhaProjetoTipo } from './dto/create-campanha-projeto-tipo.dto';

@Injectable()
export class CampanhaProjetoTipoService {
  constructor(private prisma: PrismaService) {}

  async create(createCampanhaProjetoTipo: CreateCampanhaProjetoTipo) {
    const id_projeto_tipo = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_projeto_tipo (nom_projeto_tipo, nom_usu_create, dat_usu_create, dsc_comentarios, tipo_intervencao_id, fl_controlar_cronograma)
        VALUES ('${createCampanhaProjetoTipo.nom_projeto_tipo}', '${
      createCampanhaProjetoTipo.nom_usu_create
    }', now(), '${createCampanhaProjetoTipo.comentarios}',
        ${
          createCampanhaProjetoTipo.tipo_intervencao_id
            ? createCampanhaProjetoTipo.tipo_intervencao_id
            : null
        },
        ${
          createCampanhaProjetoTipo.controlar_cronograma == null
            ? false
            : createCampanhaProjetoTipo.controlar_cronograma
        })
        RETURNING ID
    `);
    createCampanhaProjetoTipo.atividades.forEach(async (atv) => {
      const id_atividade = await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_projetos_atv (id_camp_projeto_tipo, id_area, id_tarefa, qtde_dias, nom_usu_create)
        VALUES (${id_projeto_tipo[0].id}, ${atv.area_id}, ${atv.tarefa_id}, ${atv.qtde_dias}, '${createCampanhaProjetoTipo.nom_usu_create}')
        RETURNING id
      `);

      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_camp_atv_tag (id_atividade, nom_tag)
        VALUES (${id_atividade[0].id}, '${atv.atividade_id_origem}')
      `);

      atv.precedentes.forEach(async (prc) => {
        await this.prisma.$queryRawUnsafe(`
          INSERT INTO tb_camp_projetos_atv_precedentes (id_camp_projetos_atv, id_precedente, id_camp_projeto_tipo)
          VALUES (${id_atividade[0].id}, ${prc.id}, ${id_projeto_tipo[0].id})
        `);
      });
    });
  }

  async findProjetos() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT ID, NOM_PROJETO_TIPO FROM TB_CAMP_PROJETO_TIPO where dat_usu_erase is null
    `);
  }

  async findPrecedentes(id: number, id_atividade: number) {
    return await this.prisma.$queryRawUnsafe(`
    select
precedentes.id_precedente as id, true as checked, atv_precedente.nom_atividade  as nome
    from tb_camp_projeto_tipo projeto_tipo
    inner join tb_camp_projetos_atv atividades
    on atividades.id_camp_projeto_tipo = projeto_tipo.id
    inner join tb_camp_atv_tag tag
    on tag.id_atividade = atividades.id
    inner join tb_areas_atuacoes areas_atuacoes
    on areas_atuacoes.id = atividades.id_area
    inner join tb_camp_atv tarefa
    on tarefa.id = atividades.id_tarefa
    inner join tb_responsaveis responsaveis
    on responsaveis.responsavel_id  = tarefa.responsavel_id
    left join tb_camp_projetos_atv_precedentes precedentes
    on (precedentes.id_camp_projetos_atv = atividades.id and precedentes.id_camp_projeto_tipo = atividades.id_camp_projeto_tipo)
    left join tb_camp_atv atv_precedente
    on (atv_precedente.id = precedentes.id_precedente)
    where projeto_tipo.id = ${id} and projeto_tipo.dat_usu_erase is null and atividades.id = ${id_atividade}
    and precedentes.id_precedente is not null
    `);
  }

  async findRelacaoByProjeto(id: number) {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select projeto_tipo.nom_projeto_tipo, projeto_tipo.id as projeto_tipo_id, atividades.id as id_atividade,
    atividades.qtde_dias, tag.nom_tag as nome_atividade, areas_atuacoes.id as id_area, areas_atuacoes.tipo as nome_area,
    tarefa.id as id_tarefa, tarefa.nom_atividade as nom_tarefa, responsaveis.responsavel_id, responsaveis.nome_responsavel
    from tb_camp_projeto_tipo projeto_tipo
    inner join tb_camp_projetos_atv atividades
    on atividades.id_camp_projeto_tipo = projeto_tipo.id
    inner join tb_camp_atv_tag tag
    on tag.id_atividade = atividades.id
    inner join tb_areas_atuacoes areas_atuacoes
    on areas_atuacoes.id = atividades.id_area
    left join tb_camp_atv tarefa
    on tarefa.id = atividades.id_tarefa
    left join tb_responsaveis responsaveis
    on responsaveis.responsavel_id  = tarefa.responsavel_id
    where projeto_tipo.id = ${id}
    `);

    const retornar = async () => {
      const tratamento: any = [];
      for (const e of retorno) {
        const prec = await this.findPrecedentes(
          e.projeto_tipo_id,
          e.id_atividade,
        );
        const data = {
          ...e,
          precedentes: prec,
        };
        tratamento.push(data);
      }
      return tratamento;
    };

    return await retornar();
  }

  delete(id: number) {
    return this.prisma.$queryRawUnsafe(`
   UPDATE tb_camp_projeto_tipo set dat_usu_erase = now()
    WHERE id = ${id};
   `);
  }
}
