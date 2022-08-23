import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { Coordenador } from './dto/create-coordenador.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenador.dto';

@Injectable()
export class CoordenadorService {
  async create(coordenador: Coordenador) {
    return await prismaClient.coordenador.create({
      data: coordenador,
    });
  }

  async findAll() {
    const coordenador = await prismaClient.coordenador.findMany();
    return coordenador;
  }

  async findByName(nome: string) {
    // const coordenador = await prismaClient.$queryRaw(Prisma.sql`
    // select coordenador_nome from dev.tb_coordenadores tc where coordenador_nome=${nome};
    // `);
    const coordenador = await prismaClient.coordenador.findFirst({
      where: {
        coordenadorNome: nome,
      },
    });
    return coordenador;
  }

  findOne(id: number) {
    return `This action returns a #${id} coordenador`;
  }

  update(id: number, updateCoordenadorDto: UpdateCoordenadorDto) {
    return `This action updates a #${id} coordenador`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordenador`;
  }
}
