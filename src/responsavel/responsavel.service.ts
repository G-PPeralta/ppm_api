import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { ResponsavelEntity } from './entities/responsavel.entity';

@Injectable()
export class ResponsavelService {
  constructor(private prisma: PrismaService) {}

  async create(responsavel: ResponsavelEntity) {
    return await this.prisma.responsavel.create({
      data: responsavel,
    });
  }

  async findAll() {
    const responsaveis = await this.prisma.$queryRaw(
      Prisma.sql`select * from dev.tb_responsaveis tr;`,
    );
    if (!responsaveis) throw new Error('Falha na listagem de projetos');
    return responsaveis;
  }

  async findByName(nome: string) {
    // const coordenador = await prismaClient.$queryRaw(Prisma.sql`
    // select coordenador_nome from dev.tb_coordenadores tc where coordenador_nome=${nome};
    // `);
    const responsavel = await this.prisma.responsavel.findFirst({
      where: {
        nome,
      },
    });
    return responsavel;
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
