/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviços relacionado a areas de serviços do projeto
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.$queryRawUnsafe(`
        select * from tb_area where dat_usu_erase is null;
    `);
  }
}
