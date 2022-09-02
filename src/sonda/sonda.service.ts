import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateSondaDto } from './dto/create-sonda.dto';
import { UpdateSondaDto } from './dto/update-sonda.dto';

@Injectable()
export class SondaService {
  create(createSondaDto: CreateSondaDto) {
    const spt = prismaClient.sonda.create({ data: createSondaDto });
    return spt;
  }

  findAll() {
    const spt = prismaClient.sonda.findMany();
    return spt;
  }

  findOne(id: number) {
    const spt = prismaClient.sonda.findUnique({ where: { id } });
    return spt;
  }

  update(id: number, updateSondaDto: UpdateSondaDto) {
    return prismaClient.sonda.update({
      where: { id: id },
      data: { nome: updateSondaDto.nome },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} sonda`;
  }
}
