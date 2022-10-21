import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';

@Module({
  imports: [PrismaModule],
  controllers: [OcorrenciasController],
  providers: [OcorrenciasService],
})
export class OcorrenciasModule {}
