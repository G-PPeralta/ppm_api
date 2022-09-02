import { Module } from '@nestjs/common';
import { DemandaService } from './demanda.service';
import { DemandaController } from './demanda.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemandaController],
  providers: [DemandaService],
})
export class DemandaModule {}
