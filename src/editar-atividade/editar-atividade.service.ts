import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { EditarAtividadeDto } from './dto/editar-atividade.dto';

@Injectable()
export class EditarAtividadeService {
  constructor(private prisma: PrismaService) {}

  async upsert(atividade: EditarAtividadeDto) {
    //atualização da aba geral
    let flag = atividade.geral.flag;
    if (flag === undefined) {
      flag = 0;
    }

    Logger.log(
      `
        CALL sp_up_projetos_atividade_mod_estatistico(
            ${atividade.geral.id_atividade},
            '${atividade.geral.inicio_planejado}',
            ${atividade.geral.hrs_totais},
            '${atividade.geral.inicio_realizado}',
            ${atividade.geral.hrs_reais},
            ${atividade.geral.pct_real},
            ${atividade.geral.realEditado},
            ${flag});
    `,
    );

    // item invertido para resolver o problema que a última atividade não era habilitado no histórico. Antes esta procedure ficava no final.
    // dentro da procedure sp_up_projetos_atividade_mod_estatistico, há uma rotina que muda o indicador de leitura de 0 para 1 no histórico,
    // o que significa que o sistema pode considerar na média para futuras intervenções.
    if (+atividade.geral.pct_real === 100) {
      await this.prisma.$queryRawUnsafe(
        `
        call sp_in_historico_graf(${atividade.geral.id_atividade})
        `,
      );
    }

    // return 1;
    await this.prisma.$queryRawUnsafe(
      `
        CALL sp_up_projetos_atividade_mod_estatistico(
            ${atividade.geral.id_atividade},
            '${atividade.geral.inicio_planejado}',
            ${atividade.geral.hrs_totais},
            '${atividade.geral.inicio_realizado}',
            ${atividade.geral.hrs_reais},
            ${atividade.geral.pct_real},
            ${atividade.geral.realEditado},
            ${flag}); 
    `,
    );

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
        AND ind_tipo_anotacao IN (2, 3)
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

    return atividade;
  }
}
