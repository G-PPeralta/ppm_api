import { Injectable, Logger } from '@nestjs/common';
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
        }

        if (consulta) {
          consulta.forEach((e) => {
            tratamento.push(e);
          });
        }
      }
      return tratamento;
    };

    return await resolver();
  }
}
