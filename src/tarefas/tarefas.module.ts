import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';

@Module({
  imports: [PrismaModule],
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}
