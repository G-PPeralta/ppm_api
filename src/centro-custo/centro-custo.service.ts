import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';

@Injectable()
export class CentroCustoService {
  constructor(private prisma: PrismaService) {}

  async create(create: CreateCentroCustoDto, id_projeto: number) {
    return this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_centro_custo
        (valor, data, classe_servico_id, prestador_servico_id, pedido, descricao_do_servico, nom_usu_create, dat_usu_create, projeto_id)
        VALUES
        (${create.valor}, '${new Date(create.data).toISOString()})', ${
      create.classeDeServicoId
    }, ${create.prestadorServicoId}, '${create.pedido}', '${
      create.descricaoDoServico
    }', '${create.user}', now(), ${id_projeto})
    `);
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
        dat_usu_edit = now()
        WHERE
        id = ${id_custo}
    `);
  }
}
