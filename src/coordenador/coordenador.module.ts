import { Module } from '@nestjs/common';
import { CoordenadorService } from './coordenador.service';
import { CoordenadorController } from './coordenador.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoordenadorController],
  providers: [CoordenadorService],
})
export class CoordenadorModule {}
