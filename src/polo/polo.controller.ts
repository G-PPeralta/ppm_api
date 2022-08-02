import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PoloService } from './polo.service';
import { CreatePoloDto } from './dto/create-polo.dto';
import { UpdatePoloDto } from './dto/update-polo.dto';

@Controller('polo')
export class PoloController {
  constructor(private readonly poloService: PoloService) {}

  @Post()
  create(@Body() createPoloDto: CreatePoloDto) {
    return this.poloService.create(createPoloDto);
  }

  @Get()
  findAll() {
    try {
      return this.poloService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poloService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoloDto: UpdatePoloDto) {
    return this.poloService.update(+id, updatePoloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poloService.remove(+id);
  }
}
