import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.areasService.delete(+id);
  }
}
