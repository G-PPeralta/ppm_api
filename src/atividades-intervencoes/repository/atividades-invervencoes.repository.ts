/**
 * CRIADO EM: 03/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Repositorio relacionado a atividades de intervenção
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class AtividadeIntervencaoRepository {
  constructor(private prisma: PrismaService) {}

  async atividadesist() {
    return await this.prisma.atividadeIntervencao.findMany({
      select: { id: true, tarefa: true, dias: true },
    });
  }
}
