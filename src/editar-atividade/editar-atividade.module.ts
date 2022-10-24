import { Module } from '@nestjs/common';
import { EditarAtividadeService } from './editar-atividade.service';
import { EditarAtividadeController } from './editar-atividade.controller';

@Module({
  providers: [EditarAtividadeService],
  controllers: [EditarAtividadeController],
})
export class EditarAtividadeModule {}
