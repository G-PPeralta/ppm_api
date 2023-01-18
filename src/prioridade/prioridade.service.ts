/**
 * CRIADO EM: 27/07/2022
 * AUTOR: PEDRO FRANCA
 * DESCRIÇÃO: Listagem de prioridades.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class PrioridadeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.prioridadeProjeto.findMany();
  }
}
