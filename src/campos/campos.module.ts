import { Module } from '@nestjs/common';
import { CamposService } from './campos.service';
import { CamposController } from './campos.controller';
import { CampoRepository } from './repositories/campo.repository';
import { CampoExistsRule } from './validators/exists-campos.validator';
import { PoloModule } from '../polo/polo.module';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PoloModule],
  controllers: [CamposController],
  providers: [CamposService, CampoRepository, CampoExistsRule],
  exports: [CampoRepository, CampoExistsRule],
})
export class CamposModule {}
