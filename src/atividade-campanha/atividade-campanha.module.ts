import { Module } from '@nestjs/common';
import { AtividadeCampanhaService } from './atividade-campanha.service';
import { AtividadeCampanhaController } from './atividade-campanha.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  controllers: [AtividadeCampanhaController],
  providers: [AtividadeCampanhaService],
  imports: [PrismaModule],
})
export class AtividadeCampanhaModule {}
