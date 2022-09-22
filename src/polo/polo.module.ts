import { Module } from '@nestjs/common';
import { PoloService } from './polo.service';
import { PoloController } from './polo.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { PoloRepository } from './repositories/polo.repository';
import { PoloExistsRule } from './validators/exists-polo.validator';

@Module({
  imports: [PrismaModule],
  controllers: [PoloController],
  providers: [PoloService, PoloRepository, PoloExistsRule],
  exports: [PoloRepository, PoloExistsRule],
})
export class PoloModule {}
