import { Injectable } from '@nestjs/common';
import { CreatePrioridadeDto } from './dto/create-prioridade.dto';
import { UpdatePrioridadeDto } from './dto/update-prioridade.dto';

@Injectable()
export class PrioridadeService {
  create(createPrioridadeDto: CreatePrioridadeDto) {
    return 'This action adds a new prioridade';
  }

  findAll() {
    return `This action returns all prioridade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prioridade`;
  }

  update(id: number, updatePrioridadeDto: UpdatePrioridadeDto) {
    return `This action updates a #${id} prioridade`;
  }

  remove(id: number) {
    return `This action removes a #${id} prioridade`;
  }
}
