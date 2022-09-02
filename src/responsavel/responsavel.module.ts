import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { ResponsavelController } from './responsavel.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ResponsavelRepository } from './repository/responsavel.repository';
import { ResponsavelExistsRule } from './validators/existis-responsavel.validators';

@Module({
  imports: [PrismaModule],
  controllers: [ResponsavelController],
  providers: [ResponsavelService, ResponsavelRepository, ResponsavelExistsRule],
  exports: [ResponsavelService, ResponsavelRepository, ResponsavelExistsRule],
})
export class ResponsavelModule {}
