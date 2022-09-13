import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateProjetoIntervencaoDto } from './dto/create-projeto-intervencao.dto';
import { UpdateProjetoIntervencaoDto } from './dto/update-projeto-intervencao.dto';

@Injectable()
export class ProjetoIntervencaoService {
  constructor(private prisma: PrismaService) {}

  create(createProjetoIntervencaoDto: CreateProjetoIntervencaoDto) {
    return this.prisma.intervencaoProjetoTipo.create({
      data: createProjetoIntervencaoDto,
    });
  }

  findAll() {
    return `This action returns all projetoIntervencao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projetoIntervencao`;
  }

  update(id: number, updateProjetoIntervencaoDto: UpdateProjetoIntervencaoDto) {
    return `This action updates a #${id} projetoIntervencao`;
  }

  remove(id: number) {
    return `This action removes a #${id} projetoIntervencao`;
  }
}
