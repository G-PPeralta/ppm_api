import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateIntervencaoDto } from './dto/create-intervencao.dto';
// import { UpdateIntervencoeDto } from './dto/update-intervencao.dto';

@Injectable()
export class IntervencoesService {
  constructor(private prisma: PrismaService) {}

  async create(createIntervencoeDto: CreateIntervencaoDto) {
    try {
      await this.prisma.intervencao.create({
        data: createIntervencoeDto,
      });
      return 'This action adds a new intervencoe';
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  /*findAll() {
    return `This action returns all intervencoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} intervencoe`;
  }

  update(id: number, updateIntervencoeDto: UpdateIntervencoeDto) {
    return `This action updates a #${id} intervencoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} intervencoe`;
  }*/
}
