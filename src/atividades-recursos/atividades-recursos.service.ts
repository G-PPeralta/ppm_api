import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadesRecursosDto } from './dto/create-atividades-recursos.dto';

@Injectable()
export class AtividadesRecursosService {
  constructor(private prisma: PrismaService) {}

  async create(createAtividadesRecursosDto: CreateAtividadesRecursosDto) {
    const id = await this.prisma.$queryRawUnsafe(`
        insert into tb_camp_atv_recursos (id_atividade, nom_recurso, nom_usu_create, dat_usu_create)
        values (${createAtividadesRecursosDto.id_atividade}, '${createAtividadesRecursosDto.nom_recurso}', '${createAtividadesRecursosDto.nom_usu_create}',now())
    `);

    return id;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
        select * from tb_camp_atv_recursos
    `);
  }

  async findOne(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        select * from tb_camp_atv_recursos where id = ${id}
    `);
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_capm_atv_recursos where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_capm_atv_recursos SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
    delete tb_capm_atv_recursos 
    where
        id = ${id};
    `);
  }
}
