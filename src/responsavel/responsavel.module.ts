import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { ResponsavelController } from './responsavel.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResponsavelController],
  providers: [ResponsavelService],
  exports: [ResponsavelService],
})
export class ResponsavelModule {}
