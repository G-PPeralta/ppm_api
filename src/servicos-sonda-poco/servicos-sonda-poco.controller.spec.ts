import { Test, TestingModule } from '@nestjs/testing';
import { ServicosSondaPocoController } from './servicos-sonda-poco.controller';

describe('ServicosSondaPocoController', () => {
  let controller: ServicosSondaPocoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicosSondaPocoController],
    }).compile();

    controller = module.get<ServicosSondaPocoController>(
      ServicosSondaPocoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
