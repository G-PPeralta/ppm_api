import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadeNotasDto } from './dto/create-projeto-atividade-notas.dto';

@Injectable()
export class ProjetosAtividadesNotasService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetosAtividadesNotasDto: CreateProjetosAtividadeNotasDto,
  ) {
    return null;
  }

  async findAll() {
    return null;
  }

  async findOne(id: number) {
    return null;
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from dev.tb_projetos_atv_notas where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE dev.tb_projetos_atv_notas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        delete dev.tb_projetos_atv_notas where id = ${id}
    `);
  }
}
