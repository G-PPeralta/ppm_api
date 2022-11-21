import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FeriadosController } from './feriados.controller';
import { FeriadosService } from './feriados.service';

@Module({
  imports: [PrismaModule],
  controllers: [FeriadosController],
  providers: [FeriadosService],
})
export class FeriadosModule {}
