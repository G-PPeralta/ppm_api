import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreatePoloDto } from './dto/create-polo.dto';
import { UpdatePoloDto } from './dto/update-polo.dto';

@Injectable()
export class PoloService {
  async create(createPoloDto: CreatePoloDto) {
    await prismaClient.polo.create({ data: createPoloDto });
  }

  findAll() {
    const polos = prismaClient.polo.findMany();
    if (!polos) throw new Error('Falha na listagem de polos');
    return polos;
  }

  findOne(id: number) {
    return `This action returns a #${id} polo`;
  }

  update(id: number, updatePoloDto: UpdatePoloDto) {
    return `This action updates a #${id} polo`;
  }

  remove(id: number) {
    return `This action removes a #${id} polo`;
  }
}
