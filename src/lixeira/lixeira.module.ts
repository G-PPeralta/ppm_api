import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LixeiraController } from './lixeira.controller';
import { LixeiraService } from './lixeira.service';

@Module({
  imports: [PrismaModule],
  controllers: [LixeiraController],
  providers: [LixeiraService],
})
export class LixeiraModule {}
