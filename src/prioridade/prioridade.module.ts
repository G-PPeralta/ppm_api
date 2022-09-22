import { Module } from '@nestjs/common';
import { PrioridadeService } from './prioridade.service';
import { PrioridadeController } from './prioridade.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrioridadeController],
  providers: [PrioridadeService],
})
export class PrioridadeModule {}
