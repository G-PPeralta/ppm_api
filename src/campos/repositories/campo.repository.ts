/**
 * CRIADO EM: 09/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Repositorio relacionado aos campos
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class CampoRepository {
  constructor(private prisma: PrismaService) {}

  async camposList() {
    return await this.prisma.campo.findMany();
  }
}
