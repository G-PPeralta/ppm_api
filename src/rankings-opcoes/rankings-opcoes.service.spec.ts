import { Test, TestingModule } from '@nestjs/testing';
import { RankingsOpcoesService } from './rankings-opcoes.service';

describe('RankingsOpcoesService', () => {
  let service: RankingsOpcoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankingsOpcoesService],
    }).compile();

    service = module.get<RankingsOpcoesService>(RankingsOpcoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
