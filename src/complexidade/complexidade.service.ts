/**
 * CRIADO EM: 31/07/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a complexidade dos projetos
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class ComplexidadeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.complexidade.findMany();
  }
}
