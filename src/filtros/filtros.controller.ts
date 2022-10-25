import { Body, Controller, Post } from '@nestjs/common';
import { FiltroDto } from './dto/filtros.dto';
import { FiltrosService } from './filtros.service';

@Controller('filtros')
export class FiltrosController {
  constructor(private readonly service: FiltrosService) {}

  @Post()
  async findMedia(@Body() filtro: FiltroDto) {
    return await this.service.findMedia(filtro);
  }
}
