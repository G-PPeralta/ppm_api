/**
 *  CRIADO EM: 17/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: manipulação de  lixeira
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class LixeiraService {
  constructor(private prisma: PrismaService) {}

  async getLixeira() {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
      table_name, column_name, STRING_AGG(row_id::text, ',') as rows_id
      FROM fn_ver_lixeira()
      GROUP BY table_name, column_name`,
    );

    const resolver = async () => {
      const tratamento: any = [];
      for (const e of retorno) {
        let consulta: any[];
        if (e.table_name === 'tb_projetos_atividade') {
          consulta = await this.prisma.$queryRawUnsafe(`
              select id,
              case when id_pai <> 0 then concat((select nom_atividade from tb_projetos_atividade where id = deletado.id_pai), ' > ', nom_atividade)
              else nom_atividade end as local_deletado,
              case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
              else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
              case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
              else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
              from tb_projetos_atividade deletado
              where id in (${e.rows_id})
            `);
        }
        if (e.table_name === 'tb_tarefas') {
          consulta = await this.prisma.$queryRawUnsafe(`
          select id, nome_tarefa as local_deletado,
          case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                    else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                    case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                    else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
          from tb_tarefas deletado
          where id in (${e.rows_id})
          `);
          if (e.table_name === 'tb_fornecedores') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select id, 
            concat('Fornecedor > ', nomefornecedor) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
              else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
              case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
              else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_fornecedores deletado
            where id in (${e.rows_id})
            `);
          }
          if (e.table_name === 'tb_projetos') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select
            id,
            concat('Projeto > ', nome_projeto) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                          else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                          case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                          else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_projetos deletado
            where id in (${e.rows_id})
            `);
          }
          if (e.table_name === 'tb_ranking') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select id, 
            concat('Ranking > ', nom_ranking) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                          else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                          case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                          else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_ranking deletado
            where id in (${e.rows_id})
            `);
          }
          if (e.table_name === 'tb_centro_custo') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select id, 
            concat('Centro de Custo > Pedido > ', pedido) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                          else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                          case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                          else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_centro_custo deletado
            where id in (${e.rows_id})
            `);
          }
          if (e.table_name === 'tb_projetos_atv_licoes_aprendidas') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select id, 
            concat('Licao Aprendida > ', txt_licao_aprendida) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                          else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                          case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                          else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_projetos_atv_licoes_aprendidas deletado
            where id in (${e.rows_id})
            `);
          }
          if (e.table_name === 'tb_ranking_opcoes') {
            consulta = await this.prisma.$queryRawUnsafe(`
            select id, 
            concat('Opcao de Ranking > ', nom_opcao) as local_deletado,
            case when nom_usu_erase is not null then concat(to_char(dat_usu_erase, 'DD/MM/YYYY'),' por ', nom_usu_erase)
                          else to_char(dat_usu_erase, 'DD/MM/YYYY') end as exclusao,
                          case when nom_usu_create is not null then concat(to_char(dat_usu_create, 'DD/MM/YYYY'),' por ', nom_usu_create)
                          else to_char(dat_usu_create, 'DD/MM/YYYY') end as criado
            from tb_ranking_opcoes deletado
            where id in (${e.rows_id})
            `);
          }
        }

        if (consulta) {
          consulta.forEach((c) => {
            c.table_name = e.table_name;
            c.column_name = e.column_name;
            tratamento.push(c);
          });
        }
      }
      return tratamento;
    };

    return await resolver();
  }
  async restoreLixeira(id: number, table_name: string) {
    await this.prisma.$queryRawUnsafe(
      `UPDATE ${table_name} SET dat_usu_erase = NULL, nom_usu_erase = NULL WHERE ID = ${id}`,
    );
  }

  async remove(id: number, table_name: string) {
    return await this.prisma.$queryRawUnsafe(`
    DELETE FROM ${table_name} WHERE ID = ${id}
    `);
  }
}
