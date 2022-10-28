import { Body, Controller, Post } from '@nestjs/common';
import { EditarAtividadeDto } from './dto/editar-atividade.dto';
import { EditarAtividadeService } from './editar-atividade.service';

@Controller('editar-atividade')
export class EditarAtividadeController {
  constructor(private readonly service: EditarAtividadeService) {}

  @Post()
  createOrUpdate(@Body() atividade: EditarAtividadeDto) {
    return this.service.upsert(atividade);
  }
}
