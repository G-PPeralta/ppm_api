import { Injectable } from '@nestjs/common';
import { CreateDemandaDto } from './dto/create-demanda.dto';
import { UpdateDemandaDto } from './dto/update-demanda.dto';

@Injectable()
export class DemandaService {
  create(createDemandaDto: CreateDemandaDto) {
    return 'This action adds a new demanda';
  }

  findAll() {
    return `This action returns all demanda`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demanda`;
  }

  update(id: number, updateDemandaDto: UpdateDemandaDto) {
    return `This action updates a #${id} demanda`;
  }

  remove(id: number) {
    return `This action removes a #${id} demanda`;
  }
}
