import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CentroCustoService } from './centro-custo.service';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';

@Controller('centro-custo')
export class CentroCustoController {
  constructor(private readonly service: CentroCustoService) {}

  @Post(':id')
  create(@Body() create: CreateCentroCustoDto, @Param('id') id: string) {
    return this.service.create(create, +id);
  }

  @Patch(':id')
  update(@Body() update: CreateCentroCustoDto, @Param('id') id: string) {
    return this.service.update(update, +id);
  }
}
