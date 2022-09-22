import { Module } from '@nestjs/common';
import { DivisaoService } from './divisao.service';
import { DivisaoController } from './divisao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DivisaoController],
  providers: [DivisaoService],
})
export class DivisaoModule {}
