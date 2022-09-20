import { Module } from '@nestjs/common';
import { ProjetosRankingService } from './projetos-ranking.service';
import { ProjetosRankingController } from './projetos-ranking.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjetosRankingService],
  controllers: [ProjetosRankingController],
})
export class ProjetosRankingModule {}
