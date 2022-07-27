import { Injectable } from '@nestjs/common';
import { CreateClassificacaoDto } from './dto/create-classificacao.dto';
import { UpdateClassificacaoDto } from './dto/update-classificacao.dto';

@Injectable()
export class ClassificacaoService {
  create(createClassificacaoDto: CreateClassificacaoDto) {
    return 'This action adds a new classificacao';
  }

  findAll() {
    return `This action returns all classificacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classificacao`;
  }

  update(id: number, updateClassificacaoDto: UpdateClassificacaoDto) {
    return `This action updates a #${id} classificacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} classificacao`;
  }
}
