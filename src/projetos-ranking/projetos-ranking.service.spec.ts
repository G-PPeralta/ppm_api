import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosRankingService } from './projetos-ranking.service';

describe('ProjetosRankingService', () => {
  let service: ProjetosRankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosRankingService],
    }).compile();

    service = module.get<ProjetosRankingService>(ProjetosRankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
