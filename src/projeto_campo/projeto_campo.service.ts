import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetoCampoDto } from './dto/create-projeto_campo.dto';
import { UpdateProjetoCampoDto } from './dto/update-projeto_campo.dto';

@Injectable()
export class ProjetoCampoService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetoCampoDto: CreateProjetoCampoDto) {
    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_campo (campo) VALUES (${createProjetoCampoDto.campo});
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_poco;
    `);
  }

  findOne(id: number) {
    return `This action returns a #${id} projetoCampo`;
  }

  async update(id: number, updateProjetoCampoDto: UpdateProjetoCampoDto) {
    return await this.prisma.$queryRawUnsafe(`
      UPDATE tb_campo SET campo = '${updateProjetoCampoDto.campo}' WHERE id = ${id};
    `);
  }

  remove(id: number) {
    return `This action removes a #${id} projetoCampo`;
  }
}
