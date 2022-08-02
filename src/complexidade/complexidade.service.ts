import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateComplexidadeDto } from './dto/create-complexidade.dto';
import { UpdateComplexidadeDto } from './dto/update-complexidade.dto';

@Injectable()
export class ComplexidadeService {
  create(createComplexidadeDto: CreateComplexidadeDto) {
    return 'This action adds a new complexidade';
  }

  async findAll() {
    return await prismaClient.complexidade.findMany();
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
