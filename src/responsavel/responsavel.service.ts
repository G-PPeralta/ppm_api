import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { Responsavel } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Injectable()
export class ResponsavelService {
  async create(responsavel: Responsavel) {
    return await prismaClient.responsavel.create({
      data: responsavel,
    });
  }

  async findAll() {
    const responsaveis = await prismaClient.$queryRaw(
      Prisma.sql`select * from dev.tb_responsaveis tr;`,
    );
    if (!responsaveis) throw new Error('Falha na listagem de projetos');
    return responsaveis;
  }

  async findByName(nome: string) {
    // const coordenador = await prismaClient.$queryRaw(Prisma.sql`
    // select coordenador_nome from dev.tb_coordenadores tc where coordenador_nome=${nome};
    // `);
    const responsavel = await prismaClient.responsavel.findFirst({
      where: {
        nomeResponsavel: nome,
      },
    });
    return responsavel;
  }

  findOne(id: number) {
    return `This action returns a #${id} responsavel`;
  }

  update(id: number, updateResponsavelDto: UpdateResponsavelDto) {
    return `This action updates a #${id} responsavel`;
  }

  remove(id: number) {
    return `This action removes a #${id} responsavel`;
  }
}
