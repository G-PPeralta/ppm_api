/**
 * CRIADO EM: 31/07/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a classificação de projetos
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';

@Injectable()
export class ClassificacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createClassificacaoDto: CreateClassificacaoDto) {
    await this.prisma.classificacaoProjeto.create({
      data: createClassificacaoDto,
    });
  }

  async findAll() {
    const classificacao = await this.prisma.classificacaoProjeto.findMany({
      where: { deletado: false },
    });
    if (!classificacao) throw new Error('Falha na listagem de classificações');
    return classificacao;
  }
}
