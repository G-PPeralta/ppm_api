/**
 *  CRIADO EM: 24/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a Editar-atividade
 */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { EditarAtividadeDto } from './dto/editar-atividade.dto';
import { EditarAtividadeService } from './editar-atividade.service';

@UseGuards(JwtAuthGuard)
@Controller('editar-atividade')
export class EditarAtividadeController {
  constructor(private readonly service: EditarAtividadeService) {}

  @Post()
  createOrUpdate(@Body() atividade: EditarAtividadeDto) {
    return this.service.upsert(atividade);
  }
}
