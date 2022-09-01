import { Module } from '@nestjs/common';
import { IntervencoesService } from './intervencoes.service';
import { IntervencoesController } from './intervencoes.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  controllers: [IntervencoesController],
  providers: [IntervencoesService],
  imports: [PrismaModule],
})
export class IntervencoesModule {}
