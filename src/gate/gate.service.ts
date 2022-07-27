import { Injectable } from '@nestjs/common';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';

@Injectable()
export class GateService {
  create(createGateDto: CreateGateDto) {
    return 'This action adds a new gate';
  }

  findAll() {
    return `This action returns all gate`;
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
