import { Module } from '@nestjs/common';
import { DemandaService } from './demanda.service';
import { DemandaController } from './demanda.controller';

@Module({
  controllers: [DemandaController],
  providers: [DemandaService],
})
export class DemandaModule {}
