import { Module } from '@nestjs/common';
import { SolicitanteService } from './solicitante.service';
import { SolicitanteController } from './solicitante.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SolicitanteController],
  providers: [SolicitanteService],
})
export class SolicitanteModule {}
