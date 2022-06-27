import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { LogFiltered } from 'types/roles';
import { LogService } from './log.service';

@UseGuards(JwtAuthGuard)
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('filtered')
  async getFiltered(@Query() params: LogFiltered) {
    const { dt_fim, dt_inicio, limit } = params;

    return await this.logService.getLogsFiltered(dt_inicio, dt_fim, limit);
  }

  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(+id);
  }
}
