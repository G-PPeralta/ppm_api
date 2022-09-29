import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { RankingsOpcoesController } from './rankings-opcoes.controller';
import { RankingsOpcoesService } from './rankings-opcoes.service';

@Module({
  imports: [PrismaModule],
  controllers: [RankingsOpcoesController],
  providers: [RankingsOpcoesService],
})
export class RankingsOpcoesModule {}
