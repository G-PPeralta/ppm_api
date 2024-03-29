/**
 * CRIADO EM: 14/08/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a coordenadores
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateCoordenadorDto } from './dto/create-coordenador.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenador.dto';

@Injectable()
export class CoordenadorService {
  constructor(private prisma: PrismaService) {}
  async create(coordenador: CreateCoordenadorDto) {
    return await this.prisma.coordenador.create({
      data: coordenador,
    });
  }

  async findAll() {
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
      select id_coordenador, coordenador_nome from tb_coordenadores where dat_usu_erase is null
    `);

    return retorno.map((el) => {
      return {
        id: el.id_coordenador,
        coordenadorNome: el.coordenador_nome,
      };
    });
  }

  async findByName(nome: string) {
    // const coordenador = await prismaClient.$queryRaw(Prisma.sql`
    // select coordenador_nome from dev.tb_coordenadores tc where coordenador_nome=${nome};
    // `);
    const coordenador = await this.prisma.coordenador.findFirst({
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
