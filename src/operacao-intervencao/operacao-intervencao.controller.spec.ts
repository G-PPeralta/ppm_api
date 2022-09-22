import { Test, TestingModule } from '@nestjs/testing';
import { OperacaoIntervencaoController } from './operacao-intervencao.controller';

describe('OperacaoIntervencaoController', () => {
  let controller: OperacaoIntervencaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperacaoIntervencaoController],
    }).compile();

    controller = module.get<OperacaoIntervencaoController>(
      OperacaoIntervencaoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
