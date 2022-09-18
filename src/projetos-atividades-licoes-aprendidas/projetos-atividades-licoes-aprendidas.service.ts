import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetosAtividadesLicoesAprendidasDto } from './dto/projetos-atividades-licoes-aprendidas.dto';

@Injectable()
export class ProjetosAtividadesLicoesAprendidasService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetosAtividadesLicoesAprendidasDto: CreateProjetosAtividadesLicoesAprendidasDto,
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
    select CAST(count(*) AS INT) as qt from dev.tb_projetos_atv_licoes_aprendidas where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE dev.tb_projetos_atv_licoes_aprendidas SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  async remove(id: number) {
    return await this.prisma.$queryRawUnsafe(`
        delete dev.tb_projetos_atv_licoes_aprendidas where id = ${id}
    `);
  }
}
