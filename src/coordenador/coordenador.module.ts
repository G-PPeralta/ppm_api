import { Module } from '@nestjs/common';
import { CoordenadorService } from './coordenador.service';
import { CoordenadorController } from './coordenador.controller';

@Module({
  controllers: [CoordenadorController],
  providers: [CoordenadorService],
})
export class CoordenadorModule {}
