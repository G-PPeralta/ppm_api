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
