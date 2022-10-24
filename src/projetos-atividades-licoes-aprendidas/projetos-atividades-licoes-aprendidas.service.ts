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
      values (${createProjetosAtividadesLicoesAprendidasDto.id_projeto}, ${createProjetosAtividadesLicoesAprendidasDto.id_categoria}, '${createProjetosAtividadesLicoesAprendidasDto.txt_licao_aprendida}', '${createProjetosAtividadesLicoesAprendidasDto.txt_acao}', '${createProjetosAtividadesLicoesAprendidasDto.nom_usu_create}', now())
      returning id_projeto
      `);

    return id;
  }

  async findAll() {
    return this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_licoes_aprendidas
    `);
  }

  async findOne(id: number) {
    return this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_licoes_aprendidas where id_projeto = ${id}
    `);
  }

  async findOneLicao(id_do_projeto: number, id_da_licao: number) {
    return this.prisma.$queryRawUnsafe(`
      select * from tb_projetos_atv_licoes_aprendidas where id_projeto = ${id_do_projeto} and id = ${id_da_licao}
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
      txt_acao = '${payload.txt_acao}',
      txt_licao_aprendida = '${payload.txt_licao_aprendida}'
      WHERE
      id = ${id_da_licao}
      AND id_projeto = ${id_do_projeto}
    `);
  }

  async removeOne(id_do_projeto: number, id_da_licao: number) {
    return await this.prisma.$queryRawUnsafe(`
      delete tb_projetos_atv_licoes_aprendidas WHERE id = ${id_da_licao} and id_projeto = ${id_do_projeto}
    `);
  }

  async remove(id: number, user: string) {
    return await this.prisma.$queryRawUnsafe(`
      update tb_projetos_atv_licoes_aprendidas set dat_usu_exc = now(), nom_usu_exc = '${user}' where id = ${id}
    `);
  }
}
