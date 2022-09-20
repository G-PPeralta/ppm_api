import { Module } from '@nestjs/common';
import { ProjetosRankingService } from './projetos-ranking.service';
import { ProjetosRankingController } from './projetos-ranking.controller';

@Module({
  providers: [ProjetosRankingService],
  controllers: [ProjetosRankingController],
})
export class ProjetosRankingModule {}
