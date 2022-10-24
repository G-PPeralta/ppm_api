import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FiltrosController } from './filtros.controller';
import { FiltrosService } from './filtros.service';

@Module({
  imports: [PrismaModule],
  controllers: [FiltrosController],
  providers: [FiltrosService],
})
export class FiltrosModule {}
