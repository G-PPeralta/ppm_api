import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { GanttService } from './gantt.service';
import { CreateGanttDto } from './dto/create-gantt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('/gant')
  async findAllGant() {
    try {
      return this.ganttService.findAllGant();
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
