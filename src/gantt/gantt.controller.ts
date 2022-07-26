import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { GanttService } from './gantt.service';
import { CreateGanttDto } from './dto/create-gantt.dto';

@Controller('gantt')
export class GanttController {
  constructor(private readonly ganttService: GanttService) {}

  @Post()
  create(@Body() createGanttDto: CreateGanttDto) {
    return this.ganttService.create(createGanttDto);
  }

  @Get()
  async findAll() {
    try {
      return this.ganttService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ganttService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGanttDto: UpdateGanttDto) {
  //   return this.ganttService.update(+id, updateGanttDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ganttService.remove(+id);
  }
}
