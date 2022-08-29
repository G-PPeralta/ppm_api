import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
import { PrismaService } from '../services/prisma/prisma.service';
import { CampanhaDto, SondasDto } from './dto/campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  create(createCampanhaDto: CreateCampanhaDto) {
    return 'This action adds a new campanha';
  }

  async findAll() {
    const spts: CampanhaDto[] = await prismaClient.$queryRaw(Prisma.sql`
    select
    distinct tc.spt,
    tc2.poco ,
    tc2.inicio_planejado "inicioPlanejado",
    tc2.porcentagem 
  from
    tb_campanhas tc
  left join tb_campanhas tc2 
    on tc.spt = tc2.spt order by tc.spt ;
    `);
    const sondas = new Set(spts.map((s) => s.spt));
    const sondasArr: string[] = Array.from(sondas);
    const result: SondasDto[] = sondasArr.map((s) => ({
      sonda: s,
      pocos: spts
        .filter((p) => p.spt === s)
        .map((s: CampanhaDto) => ({
          poco: s.poco,
          inicioPlanejado: s.inicioPlanejado,
          porcentagem: s.porcentagem,
        })),
    }));
    return result;
  }

  findOne(id: number) {
    return this.prisma.campanhas.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCampanhaDto: UpdateCampanhaDto) {
    return `This action updates a #${id} campanha`;
  }

  remove(id: number) {
    return `This action removes a #${id} campanha`;
  }
}
