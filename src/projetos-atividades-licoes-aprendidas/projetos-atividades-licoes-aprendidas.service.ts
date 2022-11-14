import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadesLicoesAprendidasDto } from './dto/projetos-atividades-licoes-aprendidas.dto';

@Injectable()
export class ProjetosAtividadesLicoesAprendidasService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetosAtividadesLicoesAprendidasDto: CreateProjetosAtividadesLicoesAprendidasDto,
  ) {
    const id = this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_atv_licoes_aprendidas (id_projeto, id_categoria, txt_licao_aprendida, txt_acao, nom_usu_create, dat_usu_create)
      values (${
        createProjetosAtividadesLicoesAprendidasDto.id_atividade
      }, null, '${
      createProjetosAtividadesLicoesAprendidasDto.licao_aprendida
    }', '${
      createProjetosAtividadesLicoesAprendidasDto.acoes_e_recomendacoes
    }', '${createProjetosAtividadesLicoesAprendidasDto.user}', '${new Date(
      createProjetosAtividadesLicoesAprendidasDto.data,
    ).toISOString()}')
      returning id_projeto
      `);

    return id;
  }

  async findAll() {
    return this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_licoes_aprendidas;
    `);
  }

  async findOne(id: number) {
    return this.prisma.$queryRawUnsafe(`
      select id, txt_licao_aprendida as licao_aprendida, dat_usu_create as data, txt_acao as acao_e_recomendacao from tb_projetos_atv_licoes_aprendidas where dat_usu_erase is null and id_projeto = ${id}
    `);
  }

  async findOneLicao(id_do_projeto: number, id_da_licao: number) {
    return this.prisma.$queryRawUnsafe(`
      select id, txt_licao_aprendida as licao_aprendida, dat_usu_create as data, txt_acao as acao_e_recomendacao from tb_projetos_atv_licoes_aprendidas where id_projeto = ${id_do_projeto} and id = ${id_da_licao}
    `);
  }

  async update(id: number, campo: string, valor: string, user: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_projetos_atv_licoes_aprendidas where id = ${id} and dat_usu_exc is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_projetos_atv_licoes_aprendidas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }, nom_usu_alt = '${user}', dat_usu_alt = now()
      where id = ${id}`);
    }
  }

  async updateOne(
    id_do_projeto: number,
    id_da_licao: number,
    payload: CreateProjetosAtividadesLicoesAprendidasDto,
  ) {
    return await this.prisma.$queryRawUnsafe(`
      UPDATE tb_projetos_atv_licoes_aprendidas
      SET
      txt_acao = '${payload.acoes_e_recomendacoes}',
      txt_licao_aprendida = '${payload.licao_aprendida}',
      dat_usu_create = '${new Date(payload.data).toISOString()}'
      WHERE
      id = ${id_da_licao}
      AND id_projeto = ${id_do_projeto}
    `);
  }

  async removeOne(id_do_projeto: number, id_da_licao: number) {
    return await this.prisma.$queryRawUnsafe(`
      delete from tb_projetos_atv_licoes_aprendidas WHERE id = ${id_da_licao} and id_projeto = ${id_do_projeto}
    `);
  }

  async remove(id: number, user: string) {
    return await this.prisma.$queryRawUnsafe(`
      update tb_projetos_atv_licoes_aprendidas set dat_usu_erase = now(), nom_usu_exc = '${user}' where id = ${id}
    `);
  }
}
