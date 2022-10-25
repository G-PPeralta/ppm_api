import { Module } from '@nestjs/common';
import { EditarAtividadeService } from './editar-atividade.service';
import { EditarAtividadeController } from './editar-atividade.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EditarAtividadeService],
  controllers: [EditarAtividadeController],
})
export class EditarAtividadeModule {}
