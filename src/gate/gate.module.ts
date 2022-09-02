import { Module } from '@nestjs/common';
import { GateService } from './gate.service';
import { GateController } from './gate.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GateController],
  providers: [GateService],
})
export class GateModule {}
