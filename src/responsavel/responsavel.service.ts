import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Injectable()
export class ResponsavelService {
  async create(createResponsavelDto: CreateResponsavelDto) {
    return await prismaClient.responsavel.create({
      data: createResponsavelDto,
    });
  }

  async findAll() {
    const responsaveis = await prismaClient.responsavel.findMany();
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
