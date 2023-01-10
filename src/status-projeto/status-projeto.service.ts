import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateStatusProjetoDto } from './dto/create-status-projeto.dto';
import { UpdateStatusProjetoDto } from './dto/update-status-projeto.dto';

@Injectable()
export class StatusProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createStatusProjetoDto: CreateStatusProjetoDto) {
    return await this.prisma.statusProjeto.create({
      data: createStatusProjetoDto,
    });
  }

  async findAll() {
    return await this.prisma.statusProjeto.findMany({
      where: { deletado: false },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} statusProjeto`;
  }

  update(id: number, updateStatusProjetoDto: UpdateStatusProjetoDto) {
    return `This action updates a #${id} statusProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusProjeto`;
  }
}
