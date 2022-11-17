import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { LixeiraService } from './lixeira.service';

@Controller('lixeira')
export class LixeiraController {
  constructor(private readonly service: LixeiraService) {}

  @Get()
  getLixeira() {
    return this.service.getLixeira();
  }

  @Patch(':id/:table_name')
  update(@Param('id') id: string, @Param('table_name') table_name: string) {
    return this.service.restoreLixeira(+id, table_name);
  }

  @Delete(':id/:table_name')
  @HttpCode(200)
  remove(@Param('id') id: string, @Param('table_name') table_name: string) {
    return this.service.remove(+id, table_name);
  }
}
