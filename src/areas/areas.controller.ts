import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AreasService } from './areas.service';

@UseGuards(JwtAuthGuard)
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
