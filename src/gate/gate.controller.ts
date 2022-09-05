import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { GateService } from './gate.service';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gate')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Post()
  create(@Body() createGateDto: CreateGateDto) {
    return this.gateService.create(createGateDto);
  }

  @Get()
  findAll() {
    try {
      return this.gateService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGateDto: UpdateGateDto) {
    return this.gateService.update(+id, updateGateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gateService.remove(+id);
  }
}
