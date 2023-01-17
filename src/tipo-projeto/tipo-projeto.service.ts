/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: SERVIÇO DE CRIAÇÃO E LISTAGEM DE TIPOS DE PROJETO (Ex: Estudo, Projeto)
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateTipoProjetoDto } from './dto/create-tipo-projeto.dto';

@Injectable()
export class TipoProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createTipoProjetoDto: CreateTipoProjetoDto) {
    const tipo = await this.prisma.tipoProjeto.create({
      data: createTipoProjetoDto,
    });
    return tipo;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
    select * from tb_tipos_projeto where deletado = false
  `);
  }
}
