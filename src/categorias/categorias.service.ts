import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'services/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return 'This action adds a new categoria';
  }

  findAll() {
    const categorias = this.prisma.$queryRaw(Prisma.sql`
    select * from tb_categoria;
  `);
    return categorias;
  }

  findOne(id: number) {
    const categoria = this.prisma.$queryRaw(Prisma.sql`
    select * from tb_categoria where id=${id};
  `);
    return categoria;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
