import { Module } from '@nestjs/common';
import { PrioridadeService } from './prioridade.service';
import { PrioridadeController } from './prioridade.controller';

@Module({
  controllers: [PrioridadeController],
  providers: [PrioridadeService]
})
export class PrioridadeModule {}
