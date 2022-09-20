import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadesNotasDto } from './dto/create-atividades-notas.dto';

@Injectable()
export class AtividadesNotasService {
  constructor(private prisma: PrismaService) {}

  async create(createAtividadesNotasDto: CreateAtividadesNotasDto) {
    const id = await this.prisma.$queryRawUnsafe(`
      insert into dev.tb_camp_atv_notas (id_atividade, txt_nota, nom_usu_create, dat_usu_create)
      values (${createAtividadesNotasDto.id_atividade}, '${createAtividadesNotasDto.txt_nota}', '${createAtividadesNotasDto.nom_usu_create}', now())
      returning id
    `);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
      select * from dev.tb_camp_atv_notas
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
      select * from dev.tb_camp_atv_notas where id = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from dev.tb_camp_atv_notas where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE dev.tb_camp_atv_notas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        delete from dev.tb_camp_atv_notas where id = ${id};
    `);
  }
}
