import { Injectable } from '@nestjs/common';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { UpdateAreaAtuacaoDto } from './dto/update-area-atuacao.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class AreaAtuacaoService {
  constructor(private prisma: PrismaService) {}

  create(createAreaAtuacaoDto: CreateAreaAtuacaoDto) {
    const area = this.prisma.areaAtuacao.create({ data: createAreaAtuacaoDto });
    return area;
  }

  findAll() {
    const area = this.prisma.areaAtuacao.findMany();
    return area;
  }

  findOne(id: number) {
    return `This action returns a #${id} areaAtuacao`;
  }

  update(id: number, updateAreaAtuacaoDto: UpdateAreaAtuacaoDto) {
    return `This action updates a #${id} areaAtuacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} areaAtuacao`;
  }
}
