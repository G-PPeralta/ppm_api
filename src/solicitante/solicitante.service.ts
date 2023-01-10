import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';

@Injectable()
export class SolicitanteService {
  constructor(private prisma: PrismaService) {}

  async create(createSolicitanteDto: CreateSolicitanteDto) {
    await this.prisma.solicitanteProjeto.create({
      data: createSolicitanteDto,
    });
  }

  async findAll() {
    const solicitante = await this.prisma.solicitanteProjeto.findMany({
      where: {
        deletado: false,
      },
    });
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
