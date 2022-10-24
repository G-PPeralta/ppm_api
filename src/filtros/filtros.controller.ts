import { Body, Controller, Post } from '@nestjs/common';
import { FiltroDto } from './dto/filtros.dto';
import { FiltrosService } from './filtros.service';

@Controller('filtros')
export class FiltrosController {
  constructor(private readonly service: FiltrosService) {}

  @Post()
  findMedia(@Body() filtro: FiltroDto) {
    return this.service.findMedia(filtro);
  }
}
