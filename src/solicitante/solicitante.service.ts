import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';

@Injectable()
export class SolicitanteService {
  async create(createSolicitanteDto: CreateSolicitanteDto) {
    await prismaClient.solicitanteProjeto.create({
      data: createSolicitanteDto,
    });
  }

  findAll() {
    const solicitante = prismaClient.solicitanteProjeto.findMany();
    if (!solicitante) throw new Error('Falha na listagem de solicitantes');
    return solicitante;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitante`;
  }

  update(id: number, updateSolicitanteDto: UpdateSolicitanteDto) {
    return `This action updates a #${id} solicitante`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitante`;
  }
}
