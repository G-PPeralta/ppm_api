import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { EstatisticasController } from './estatisticas.controller';
import { EstatisticasService } from './estatisticas.service';

@Module({
  imports: [PrismaModule],
  controllers: [EstatisticasController],
  providers: [EstatisticasService],
})
export class EstatisticasModule {}
