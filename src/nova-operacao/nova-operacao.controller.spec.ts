import { Test, TestingModule } from '@nestjs/testing';
import { NovaOperacaoController } from './nova-operacao.controller';

describe('NovaOperacaoController', () => {
  let controller: NovaOperacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NovaOperacaoController],
    }).compile();

    controller = module.get<NovaOperacaoController>(NovaOperacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
