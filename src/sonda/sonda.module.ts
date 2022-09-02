import { Module } from '@nestjs/common';
import { SondaService } from './sonda.service';
import { SondaController } from './sonda.controller';

@Module({
  controllers: [SondaController],
  providers: [SondaService],
})
export class SondaModule {}
