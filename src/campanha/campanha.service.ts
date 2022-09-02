import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CampanhaDto } from './dto/campanha.dto';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';

@Injectable()
export class CampanhaService {
  constructor(private prisma: PrismaService) {}

  create(createCampanhaDto: CreateCampanhaDto) {
    return 'This action adds a new campanha';
  }

  async findAll() {
    const spts: CampanhaDto[] = await this.prisma.$queryRaw(Prisma.sql`
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
    const result: any[] = sondasArr.map(async (s) => ({
      sonda: s,
      pocos: await this.prisma.campanhas.findMany({
        select: { poco: true, inicio_planejado: true },
        distinct: ['poco'],
        where: { spt: s },
      }),
    }));
    return await Promise.all(result);
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
