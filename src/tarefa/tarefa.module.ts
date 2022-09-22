import { Module } from '@nestjs/common';
import { TarefaService } from './tarefa.service';
import { TarefaController } from './tarefa.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { TarefaRepository } from './repository/tarefa.repository';
import { TarefaExistsRule } from './validators/existis-tarefa.validator';

@Module({
  imports: [PrismaModule],
  controllers: [TarefaController],
  providers: [TarefaService, TarefaExistsRule, TarefaRepository],
  exports: [TarefaExistsRule, TarefaRepository],
})
export class TarefaModule {}
