import { Module } from '@nestjs/common';
import { SolicitanteService } from './solicitante.service';
import { SolicitanteController } from './solicitante.controller';

@Module({
  controllers: [SolicitanteController],
  providers: [SolicitanteService]
})
export class SolicitanteModule {}
