import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.$queryRawUnsafe(`
        select * from tb_area where dat_usu_erase is null;
    `);
  }

  async delete(id: number) {
    return this.prisma.$queryRawUnsafe(`
    UPDATE tb_area set dat_usu_erase = now()
    WHERE id = ${id};
    `);
  }
}
