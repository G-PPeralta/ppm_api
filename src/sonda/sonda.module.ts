import { Module } from '@nestjs/common';
import { SondaService } from './sonda.service';
import { SondaController } from './sonda.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SondaController],
  providers: [SondaService],
})
export class SondaModule {}
