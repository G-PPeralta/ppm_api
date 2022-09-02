import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';

@Injectable()
export class ClassificacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createClassificacaoDto: CreateClassificacaoDto) {
    await this.prisma.classificacaoProjeto.create({
      data: createClassificacaoDto,
    });
  }

  async findAll() {
    const classificacao = await this.prisma.classificacaoProjeto.findMany();
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
