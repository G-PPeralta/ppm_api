/**
 *  CRIADO EM: 02/08/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Manipulação informações pertinestes a divisão
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateDivisaoDto } from './dto/create-divisao.dto';

@Injectable()
export class DivisaoService {
  constructor(private prisma: PrismaService) {}
  async create(createDivisaoDto: CreateDivisaoDto) {
    await this.prisma.divisaoProjeto.create({ data: createDivisaoDto });
  }

  findAll() {
    const divisoes = this.prisma.divisaoProjeto.findMany({
      where: { deletado: false },
    });
    if (!divisoes) throw new Error('Falha na listagem de divisões');
    return divisoes;
  }
}
