/**
 * CRIADO EM: 16/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviços relacionados a centro de custo
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';

@Injectable()
export class CentroCustoService {
  constructor(private prisma: PrismaService) {}

  async create(create: CreateCentroCustoDto, id_projeto: number) {
    return this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_centro_custo
        (valor, data, classe_servico_id, prestador_servico_id, pedido, descricao_do_servico, nom_usu_create, dat_usu_create, projeto_id, bm, id_nf, valor_bm_nf, status, data_pagamento, valor_pago)
        VALUES
        (${create.valor}, '${new Date(create.data).toISOString()})', ${
      create.classeDeServicoId
    }, ${create.prestadorServicoId}, '${create.pedido}', '${
      create.descricaoDoServico
    }', '${create.user}', now(), ${id_projeto}, '${create.bm}', '${
      create.id_nf
    }', ${create.valor_bm_nf}, ${create.status}, ${
      create.data_pagamento === null
        ? null
        : "'" + new Date(create.data_pagamento).toISOString() + "'"
    }, ${create.valor_pago})
    `);
  }

  async getRange(id: number) {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
      select
      min(dat_ini_plan) as data_inicio,
      max(dat_fim_plan) as data_final
      from tb_projetos_atividade projeto
      where projeto.id_projeto = ${id}
    `);

    return retorno[0];
  }

  async update(update: CreateCentroCustoDto, id_custo: number) {
    return this.prisma.$queryRawUnsafe(`
        UPDATE tb_centro_custo
        SET
        valor = ${update.valor},
        data = '${new Date(update.data).toISOString()}',
        classe_servico_id = ${update.classeDeServicoId},
        prestador_servico_id = ${update.prestadorServicoId},
        pedido = '${update.pedido}',
        descricao_do_servico = '${update.descricaoDoServico}',
        nom_usu_edit = '${update.user}',
        bm = '${update.bm}',
        id_nf = '${update.id_nf}',
        valor_bm_nf = ${update.valor_bm_nf},
        status = ${update.status},
        data_pagamento = ${
          update.data_pagamento === null
            ? null
            : "'" + new Date(update.data_pagamento).toISOString() + "'"
        },
        valor_pago = ${update.valor_pago},
        dat_usu_edit = now()
        WHERE
        id = ${id_custo}
    `);
  }

  async delete(id_custo: number, nom_usu_erase: string) {
    return this.prisma.$queryRawUnsafe(`
      UPDATE tb_centro_custo
      SET
      dat_usu_erase = now(),
      nom_usu_erase = '${nom_usu_erase}'
      WHERE
      id = ${id_custo}
    `);
  }
}
