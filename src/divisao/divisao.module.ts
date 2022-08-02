import { Module } from '@nestjs/common';
import { DivisaoService } from './divisao.service';
import { DivisaoController } from './divisao.controller';

@Module({
  controllers: [DivisaoController],
  providers: [DivisaoService],
})
export class DivisaoModule {}
