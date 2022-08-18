import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreatePepDto } from './dto/create-pep.dto';
import { UpdatePepDto } from './dto/update-pep.dto';

@Injectable()
export class PepService {
  async create(createPepDto: CreatePepDto) {
    const pep = await prismaClient.pep.create({ data: createPepDto });
    return pep;
  }

  async findAll() {
    const pep = await prismaClient.pep.findMany();
    return pep;
  }

  findOne(id: number) {
    return `This action returns a #${id} pep`;
  }

  update(id: number, updatePepDto: UpdatePepDto) {
    return `This action updates a #${id} pep`;
  }

  remove(id: number) {
    return `This action removes a #${id} pep`;
  }
}
