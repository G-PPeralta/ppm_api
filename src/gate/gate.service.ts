import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';

@Injectable()
export class GateService {
  async create(createGateDto: CreateGateDto) {
    await prismaClient.gate.create({ data: createGateDto });
  }

  findAll() {
    const gates = prismaClient.gate.findMany();
    if (!gates) throw new Error('Falha na listagem de gates');
    return gates;
  }

  findOne(id: number) {
    return `This action returns a #${id} gate`;
  }

  update(id: number, updateGateDto: UpdateGateDto) {
    return `This action updates a #${id} gate`;
  }

  remove(id: number) {
    return `This action removes a #${id} gate`;
  }
}
