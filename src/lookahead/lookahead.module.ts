import { Module } from '@nestjs/common';
import { LookaheadService } from './lookahead.service';
import { LookaheadController } from './lookahead.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LookaheadController],
  providers: [LookaheadService],
})
export class LookaheadModule {}
