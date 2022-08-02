import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';

@Injectable()
export class ClassificacaoService {
  async create(createClassificacaoDto: CreateClassificacaoDto) {
    await prismaClient.classificacaoProjeto.create({
      data: createClassificacaoDto,
    });
  }

  findAll() {
    const classificacao = prismaClient.classificacaoProjeto.findMany();
    if (!classificacao) throw new Error('Falha na listagem de classificações');
    return classificacao;
  }

  findOne(id: number) {
    return `This action returns a #${id} classificacao`;
  }

  update(id: number, updateClassificacaoDto: UpdateClassificacaoDto) {
    return `This action updates a #${id} classificacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} classificacao`;
  }
}
