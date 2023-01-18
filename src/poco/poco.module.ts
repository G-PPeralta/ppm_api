import { Module } from '@nestjs/common';
import { PocoService } from './poco.service';
import { PocoController } from './poco.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PocoController],
  providers: [PocoService],
})
export class PocoModule {}
