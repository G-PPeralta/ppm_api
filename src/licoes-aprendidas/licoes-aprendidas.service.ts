import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateLicoesAprendidasDto } from './dto/create-licoes-aprendidas.dto';

@Injectable()
export class LicoesAprendidasService {
  constructor(private prisma: PrismaService) {}

  async create(createLicoesAprendidasDto: CreateLicoesAprendidasDto) {
    const id = await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_camp_atv_licoes_aprendidas
    (id_atividade, id_categoria, txt_licao_aprendida, txt_acao, nom_usu_create, dat_usu_create)
    VALUES(${createLicoesAprendidasDto.id_atividade}, ${createLicoesAprendidasDto.id_categoria}, '${createLicoesAprendidasDto.txt_licao_aprendida}', '${createLicoesAprendidasDto.txt_acao}', '${createLicoesAprendidasDto.nom_usu_create}', now());
    returning id`);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
      select * from tb_camp_atv_licoes_aprendidas
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
      select * from tb_camp_atv_licoes_aprendidas where id = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_camp_atv_licoes_aprendidas where id = ${id};
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_camp_atv_licoes_aprendidas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      `);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    delete from tb_camp_atv_licoes_aprendidas where id = ${id};
    `);
  }
}
