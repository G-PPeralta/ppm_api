import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateComplexidadeDto } from './dto/create-complexidade.dto';
import { UpdateComplexidadeDto } from './dto/update-complexidade.dto';

@Injectable()
export class ComplexidadeService {
  constructor(private prisma: PrismaService) {}
  create(createComplexidadeDto: CreateComplexidadeDto) {
    return 'This action adds a new complexidade';
  }

  async findAll() {
    return await this.prisma.complexidade.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} complexidade`;
  }

  update(id: number, updateComplexidadeDto: UpdateComplexidadeDto) {
    return `This action updates a #${id} complexidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} complexidade`;
  }
}
