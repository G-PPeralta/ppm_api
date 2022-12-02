import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { EditarAtividadeDto } from './dto/editar-atividade.dto';

@Injectable()
export class EditarAtividadeService {
  constructor(private prisma: PrismaService) {}

  async upsert(atividade: EditarAtividadeDto) {
    //atualização da aba geral
    await this.prisma.$queryRawUnsafe(`
        UPDATE tb_projetos_atividade
        SET
        nom_atividade = '${atividade.geral.nome_atividade}',
        pct_real = ${atividade.geral.pct_real},
        dat_ini_real = ${
          atividade.geral.inicio_realizado === null
            ? null
            : "'" +
              new Date(atividade.geral.inicio_realizado).toISOString() +
              "'"
        },
        dat_fim_real = ${
          atividade.geral.fim_realizado === null
            ? null
            : "'" + new Date(atividade.geral.fim_realizado).toISOString() + "'"
        },
        dat_ini_plan = ${
          atividade.geral.inicio_planejado === null
            ? null
            : "'" +
              new Date(atividade.geral.inicio_planejado).toISOString() +
              "'"
        },
        dat_fim_plan = ${
          atividade.geral.fim_planejado === null
            ? null
            : "'" + new Date(atividade.geral.fim_planejado).toISOString() + "'"
        }
        WHERE id = ${atividade.geral.id_atividade}
    `);

    //criação ou atualização das anotações
    await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atv_notas
        (id_atividade, txt_nota, nom_usu_create, dat_usu_create, ind_tipo_anotacao)
        VALUES
        (${atividade.geral.id_atividade}, '${atividade.anotacoes.anotacoes}', '${atividade.nom_usu_create}', now(), 1)
        ON CONFLICT (id_atividade, ind_tipo_anotacao) DO
        UPDATE
        SET
        txt_nota = '${atividade.anotacoes.anotacoes}'
        WHERE
        tb_projetos_atv_notas.id_atividade = ${atividade.geral.id_atividade}
    `);

    await this.prisma.$queryRawUnsafe(`
        DELETE FROM tb_projetos_atv_notas
        WHERE id_atividade = ${atividade.geral.id_atividade}
        AND ind_tipo_anotacao = 2
    `);

    //criação ou atualização dos mocs
    atividade.mocs.forEach(async (moc) => {
      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atv_notas
        (id_atividade, txt_nota, nom_usu_create, dat_usu_create, ind_tipo_anotacao, url_anexo)
        VALUES
        (${atividade.geral.id_atividade}, '${moc.numero_moc}', '${atividade.nom_usu_create}', now(), 2, '${moc.anexo}')
        `);
    });

    atividade.aprs.forEach(async (apr) => {
      await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_atv_notas
        (id_atividade, txt_nota, nom_usu_create, dat_usu_create, ind_tipo_anotacao, url_anexo)
        VALUES
        (${atividade.geral.id_atividade}, '${apr.codigo_apr}', '${atividade.nom_usu_create}', now(), 3, '${apr.anexo}')
      `);
    });

    await this.prisma.$queryRawUnsafe(`
      call sp_up_atualiza_pct_real_campanha_execucao(${atividade.id_poco_pai})
    `);

    return atividade;
  }
}
