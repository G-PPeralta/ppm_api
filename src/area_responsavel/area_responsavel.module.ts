import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AreaResponsavelController } from './area_responsavel.controller';
import { AreaResponsavelService } from './area_responsavel.service';

@Module({
  imports: [PrismaModule],
  controllers: [AreaResponsavelController],
  providers: [AreaResponsavelService],
})
export class AreaResponsavelModule {}
