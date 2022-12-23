import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AreaResponsavelService } from './area_responsavel.service';

@Controller('area-responsavel')
export class AreaResponsavelController {
  constructor(private service: AreaResponsavelService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.service.getAll();
  }
}
