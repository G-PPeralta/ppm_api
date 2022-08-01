import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateTipoResponsavelDto } from './dto/create-tipo-responsavel.dto';
import { UpdateTipoResponsavelDto } from './dto/update-tipo-responsavel.dto';

@Injectable()
export class TipoResponsavelService {
  create(createTipoResponsavelDto: CreateTipoResponsavelDto) {
    return 'This action adds a new tipoResponsavel';
  }

  findAll() {
    return prismaClient.tb_tipos_responsavel.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoResponsavel`;
  }

  update(id: number, updateTipoResponsavelDto: UpdateTipoResponsavelDto) {
    return `This action updates a #${id} tipoResponsavel`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoResponsavel`;
  }
}
