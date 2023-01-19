import { Module } from '@nestjs/common';
import { CamposService } from './campos.service';
import { CamposController } from './campos.controller';
import { CampoRepository } from './repositories/campo.repository';
import { PoloModule } from '../polo/polo.module';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PoloModule],
  controllers: [CamposController],
  providers: [CamposService, CampoRepository],
  exports: [CampoRepository],
})
export class CamposModule {}
