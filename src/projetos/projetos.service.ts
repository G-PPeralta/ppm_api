import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  constructor(private prismaClient: PrismaService) {}
  async create(createProjetoDto: CreateProjetoDto) {
    return await this.prismaClient.projeto.create({
      data: {
        ...createProjetoDto,
        dataFim: new Date(createProjetoDto.dataFim),
        dataFimReal: new Date(createProjetoDto.dataFimReal),
        dataInicio: new Date(createProjetoDto.dataInicio),
        dataInicioReal: new Date(createProjetoDto.dataInicioReal),
      },
    });
  }

  async findAll() {
    const projects = await this.prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async findTotalValue(id: number) {
    const totalValue = await this.prismaClient.$queryRaw(Prisma.sql`
    select
      id,
      data_inicio_formatada,
      data_fim_formatada,
      meses,
      valor_total_previsto
    from
        dev.v_grafico_curva_s
    where
        data_fim > data_inicio
        and valor_total_previsto is not null
        and id = ${id};`);
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
  }

  async findOne(id: number) {
    const project = await this.prismaClient.projeto.findUnique({
      where: { id },
    });
    return project;
  }

  async update(id: number, updateProjetoDto: UpdateProjetoDto) {
    await this.prismaClient.projeto.update({
      where: {
        id,
      },
      data: updateProjetoDto,
    });

    return `This action updates a #${id} projeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await this.prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }
}
