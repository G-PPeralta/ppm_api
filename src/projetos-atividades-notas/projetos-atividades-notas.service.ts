/**
 * CRIADO EM: 18/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Serviço que cria, lista, atualiza e remove anotações em projetos de intervenção. Essas anotações acompanham um arquivo que o usuário anexa no projeto.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadeNotasDto } from './dto/create-projeto-atividade-notas.dto';

@Injectable()
export class ProjetosAtividadesNotasService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetosAtividadesNotasDto: CreateProjetosAtividadeNotasDto,
  ) {
    const id = await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_atv_notas
      (id_atividade, txt_nota, nom_usu_create, dat_usu_create, ind_tipo_anotacao, url_anexo)
      VALUES
      (${createProjetosAtividadesNotasDto.id_atividade}, '${createProjetosAtividadesNotasDto.txt_nota}', '${createProjetosAtividadesNotasDto.nom_usu_create}',
      NOW(), ${createProjetosAtividadesNotasDto.ind_tipo_anotacao}, '${createProjetosAtividadesNotasDto.url_anexo}'
      )
      RETURNING ID
    `);

    if (
      createProjetosAtividadesNotasDto.ind_tipo_anotacao === 2 &&
      createProjetosAtividadesNotasDto.cod_moc.length > 0
    ) {
      await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atv_notas
      SET cod_moc = CONCAT('${createProjetosAtividadesNotasDto.cod_moc}', RIGHT(CONCAT('0000', ${id[0].id}), 4))
      WHERE id = ${id[0].id}
      `);
    }
  }

  async findAll(id_atividade: number) {
    return await this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_notas where id_atividade = ${id_atividade} and ind_tipo_anotacao = 1
    `);
  }

  async findMocs(id_atividade: number) {
    return await this.prisma.$queryRawUnsafe(`
      select txt_nota as numero_moc, url_anexo as anexo from tb_projetos_atv_notas where id_atividade = ${id_atividade} and ind_tipo_anotacao = 2
    `);
  }

  async findAprs(id_atividade: number) {
    return await this.prisma.$queryRawUnsafe(`
      select txt_nota as codigo_apr, url_anexo as anexo from tb_projetos_atv_notas where id_atividade = ${id_atividade} and ind_tipo_anotacao = 3
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_notas where id = ${id} and ind_tipo_anotacao = 1
    `);
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_projetos_atv_notas where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_projetos_atv_notas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        delete tb_projetos_atv_notas where id = ${id}
    `);
  }
}
