import { Injectable } from '@nestjs/common';
import { CreateComplexidadeDto } from './dto/create-complexidade.dto';
import { UpdateComplexidadeDto } from './dto/update-complexidade.dto';

@Injectable()
export class ComplexidadeService {
  create(createComplexidadeDto: CreateComplexidadeDto) {
    return 'This action adds a new complexidade';
  }

  findAll() {
    return `This action returns all complexidade`;
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
