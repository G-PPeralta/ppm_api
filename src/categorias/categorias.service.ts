/**
 * CRIADO EM: 18/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a categorias
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    const categorias = this.prisma.$queryRaw(Prisma.sql`
    select * from tb_categoria;
  `);
    return categorias;
  }
}
