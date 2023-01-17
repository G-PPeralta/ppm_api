/**
 *  CRIADO EM: 16/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Service de manipulçao de pocos.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreatePocoDto } from './dto/create-poco.dto';

@Injectable()
export class PocoService {
  constructor(private prisma: PrismaService) {}
  async create(createPocoDto: CreatePocoDto) {
    const poco = this.prisma.poco.create({ data: createPocoDto });

    await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_pocos (id_polo, id_local, nom_poco)
      VALUES (1, 1, '${createPocoDto.poco}')
    `);

    return poco;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
      select * from tb_pocos where dat_usu_erase is null
    `);
  }

  remove(id: number) {
    return this.prisma.$queryRawUnsafe(`
    UPDATE tb_pocos set dat_usu_erase = now()
    WHERE id = ${id};
    `);
  }
}
