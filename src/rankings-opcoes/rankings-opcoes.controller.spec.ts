import { Test, TestingModule } from '@nestjs/testing';
import { RankingsOpcoesController } from './rankings-opcoes.controller';

describe('RankingsOpcoesController', () => {
  let controller: RankingsOpcoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsOpcoesController],
    }).compile();

    controller = module.get<RankingsOpcoesController>(RankingsOpcoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
