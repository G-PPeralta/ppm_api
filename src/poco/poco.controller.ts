import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PocoService } from './poco.service';
import { CreatePocoDto } from './dto/create-poco.dto';
import { UpdatePocoDto } from './dto/update-poco.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('poco')
export class PocoController {
  constructor(private readonly pocoService: PocoService) {}

  @Post()
  create(@Body() createPocoDto: CreatePocoDto) {
    return this.pocoService.create(createPocoDto);
  }

  @Get()
  findAll() {
    return this.pocoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pocoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePocoDto: UpdatePocoDto) {
    return this.pocoService.update(+id, updatePocoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pocoService.remove(+id);
  }
}
