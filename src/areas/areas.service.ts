import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.$queryRawUnsafe(`
        select * from tb_area
    `);
  }
}
