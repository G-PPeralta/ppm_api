import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { GraficosService } from './graficos.service';
import { GraficosController } from './graficos.controller';
@Module({
  imports: [PrismaModule],
  controllers: [GraficosController],
  providers: [GraficosService],
})
export class GraficosModule {}
