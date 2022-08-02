import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Injectable()
export class LocalService {
  async create(createLocalDto: CreateLocalDto) {
    await prismaClient.local.create({ data: createLocalDto });
  }

  findAll() {
    const local = prismaClient.local.findMany();
    if (!local) throw new Error('Falha na listagem de locais');
    return local;
  }

  findOne(id: number) {
    return `This action returns a #${id} local`;
  }

  update(id: number, updateLocalDto: UpdateLocalDto) {
    return `This action updates a #${id} local`;
  }

  remove(id: number) {
    return `This action removes a #${id} local`;
  }
}
