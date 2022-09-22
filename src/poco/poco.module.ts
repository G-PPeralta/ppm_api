import { Module } from '@nestjs/common';
import { PocoService } from './poco.service';
import { PocoController } from './poco.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { PocoRepository } from './repositories/poco.repository';
import { PocoExistsRule } from './validators/exists-pocos.validator';

@Module({
  imports: [PrismaModule],
  controllers: [PocoController],
  providers: [PocoService, PocoRepository, PocoExistsRule],
  exports: [PocoRepository, PocoExistsRule],
})
export class PocoModule {}
