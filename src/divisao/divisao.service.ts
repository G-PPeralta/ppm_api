import { Injectable } from '@nestjs/common';
import { CreateDivisaoDto } from './dto/create-divisao.dto';
import { UpdateDivisaoDto } from './dto/update-divisao.dto';

@Injectable()
export class DivisaoService {
  create(createDivisaoDto: CreateDivisaoDto) {
    return 'This action adds a new divisao';
  }

  findAll() {
    return `This action returns all divisao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} divisao`;
  }

  update(id: number, updateDivisaoDto: UpdateDivisaoDto) {
    return `This action updates a #${id} divisao`;
  }

  remove(id: number) {
    return `This action removes a #${id} divisao`;
  }
}
