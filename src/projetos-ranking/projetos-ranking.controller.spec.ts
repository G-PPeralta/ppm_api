import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosRankingController } from './projetos-ranking.controller';

describe('ProjetosRankingController', () => {
  let controller: ProjetosRankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosRankingController],
    }).compile();

    controller = module.get<ProjetosRankingController>(
      ProjetosRankingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
