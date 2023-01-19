/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviços relacionados a dados de responsaveis de projetos
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { AreaAtuacaoRepository } from './repository/area-atuacao.repository';

@Injectable()
export class AreaAtuacaoService {
  constructor(
    private repo: AreaAtuacaoRepository,
    private prisma: PrismaService,
  ) {}

  findAll() {
    const area = this.repo.getAll();
    return area;
  }

  findByTipo(tipo: string) {
    return this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_areas_atuacoes WHERE deletado = false and area_sistema = '${tipo}'
    `);
  }
}
