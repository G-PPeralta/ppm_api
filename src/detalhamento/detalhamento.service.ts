import { Injectable } from '@nestjs/common';
import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Injectable()
export class DetalhamentoService {
  create(createDetalhamentoDto: CreateDetalhamentoDto) {
    return 'This action adds a new detalhamento';
  }

  findAll() {
    return `This action returns all detalhamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalhamento`;
  }

  update(id: number, updateDetalhamentoDto: UpdateDetalhamentoDto) {
    return `This action updates a #${id} detalhamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalhamento`;
  }
}
