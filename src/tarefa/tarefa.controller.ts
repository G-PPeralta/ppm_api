import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TarefaService } from 'tarefa/tarefa.service';
import { CreateTarefaDto } from 'tarefa/dto/create-tarefa.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerDB } from 'decorators/logger-db.decorator';

@ApiBearerAuth()
@ApiTags('Tarefas')
@UseGuards(JwtAuthGuard)
@Controller('tarefa')
export class TarefaController {
  constructor(private readonly tarefaService: TarefaService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(@Body() createTarefaDto: CreateTarefaDto, @LoggerDB() req) {
    return this.tarefaService.create(createTarefaDto);
  }

  @Get()
  async findAll() {
    const tarefas = await this.tarefaService.findAll();
    return tarefas;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarefaService.findOne(+id);
  }

  @Put(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id') id: string, @LoggerDB() req) {
    return this.tarefaService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @LoggerDB() req) {
    return this.tarefaService.remove(+id);
  }
}
