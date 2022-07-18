import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  create(createProjetoDto: CreateProjetoDto) {
    return 'This action adds a new projeto';
  }

  async findAll() {
    const projects = await prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async findTotalValue(id: number) {
    const totalValue = await prismaClient.$queryRaw(Prisma.sql`
    select
    id,
    data_inicio_formatada,
    data_fim_formatada,
    meses,
    valor_total_previsto
from
    load_mer.v_grafico_curva_s
where
    data_fim > data_inicio
    and valor_total_previsto is not null
    and id = ${id};`);
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
  }

  findOne(id: number) {
    return `This action returns a #${id} projeto`;
  }

  update(id: number, updateProjetoDto: UpdateProjetoDto) {
    return `This action updates a #${id} projeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }
}