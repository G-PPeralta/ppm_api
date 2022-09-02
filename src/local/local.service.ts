import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Injectable()
export class LocalService {
  constructor(private prisma: PrismaService) {}
  async create(createLocalDto: CreateLocalDto) {
    await this.prisma.local.create({ data: createLocalDto });
  }

  findAll() {
    const local = this.prisma.local.findMany();
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
