import { Test, TestingModule } from '@nestjs/testing';
import { DetalhamentoService } from './detalhamento.service';

describe('DetalhamentoService', () => {
  let service: DetalhamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalhamentoService],
    }).compile();

    service = module.get<DetalhamentoService>(DetalhamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
