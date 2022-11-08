import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreatePocoDto } from './dto/create-poco.dto';
import { UpdatePocoDto } from './dto/update-poco.dto';

@Injectable()
export class PocoService {
  constructor(private prisma: PrismaService) {}
  create(createPocoDto: CreatePocoDto) {
    const poco = this.prisma.poco.create({ data: createPocoDto });
    return poco;
  }

  findAll() {
    const poco = this.prisma.poco.findMany();
    return poco;
  }

  findOne(id: number) {
    return `This action returns a #${id} poco`;
  }

  update(id: number, updatePocoDto: UpdatePocoDto) {
    return `This action updates a #${id} poco`;
  }

  remove(id: number) {
    return `This action removes a #${id} poco`;
  }
}
