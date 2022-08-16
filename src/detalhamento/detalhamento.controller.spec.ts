import { Test, TestingModule } from '@nestjs/testing';
import { DetalhamentoController } from './detalhamento.controller';
import { DetalhamentoService } from './detalhamento.service';

describe('DetalhamentoController', () => {
  let controller: DetalhamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalhamentoController],
      providers: [DetalhamentoService],
    }).compile();

    controller = module.get<DetalhamentoController>(DetalhamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
