import { Injectable } from '@nestjs/common';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';

@Injectable()
export class SolicitanteService {
  create(createSolicitanteDto: CreateSolicitanteDto) {
    return 'This action adds a new solicitante';
  }

  findAll() {
    return `This action returns all solicitante`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitante`;
  }

  update(id: number, updateSolicitanteDto: UpdateSolicitanteDto) {
    return `This action updates a #${id} solicitante`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitante`;
  }
}
