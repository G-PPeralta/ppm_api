import { Injectable } from '@nestjs/common';
import { CreateStatusProjetoDto } from './dto/create-status-projeto.dto';
import { UpdateStatusProjetoDto } from './dto/update-status-projeto.dto';

@Injectable()
export class StatusProjetoService {
  create(createStatusProjetoDto: CreateStatusProjetoDto) {
    return 'This action adds a new statusProjeto';
  }

  findAll() {
    return `This action returns all statusProjeto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusProjeto`;
  }

  update(id: number, updateStatusProjetoDto: UpdateStatusProjetoDto) {
    return `This action updates a #${id} statusProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusProjeto`;
  }
}
