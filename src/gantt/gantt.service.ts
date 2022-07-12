import { Injectable } from '@nestjs/common';
import { CreateGanttDto } from './dto/create-gantt.dto';

@Injectable()
export class GanttService {
  create(createGanttDto: CreateGanttDto) {
    return 'This action adds a new gantt';
  }

  findAll() {
    return `This action returns all gantt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gantt`;
  }

  update(id: number, updateGanttDto: UpdateGanttDto) {
    return `This action updates a #${id} gantt`;
  }

  remove(id: number) {
    return `This action removes a #${id} gantt`;
  }
}
