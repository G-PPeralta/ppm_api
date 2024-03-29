/**
 *  CRIADO EM: 15/07/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a gant
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { GanttService } from './gantt.service';
import { CreateGanttDto } from './dto/create-gantt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateGanttDto } from './dto/update-gantt.dto';

@UseGuards(JwtAuthGuard)
@Controller('gantt')
export class GanttController {
  constructor(private readonly ganttService: GanttService) {}

  @Get('panorama')
  async getPanoramaGeral() {
    try {
      return this.ganttService.getPanoramaGeral();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.ganttService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  async update(@Body() updateGannt: UpdateGanttDto, @Param('id') id: string) {
    return this.ganttService.updateGantt(updateGannt, +id);
  }

  @Get('/gant')
  async findAllGant() {
    try {
      return this.ganttService.findAllGant();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('campanha')
  findCampanha() {
    return this.ganttService.findCampanha();
  }

  @Get('campanha/:id')
  findOneCampanha(@Param('id') id: string) {
    return this.ganttService.findOneCampanha(+id);
  }

  @Get('atividades/:id')
  findOneCampanhaNew(@Param('id') id: string) {
    return this.ganttService.findOneCampanhaNew(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ganttService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGanttDto: UpdateGanttDto) {
  //   return this.ganttService.update(+id, updateGanttDto);
  // }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.ganttService.deleteRecursive(+id, user);
    //return this.ganttService.remove(+id);
  }
}
