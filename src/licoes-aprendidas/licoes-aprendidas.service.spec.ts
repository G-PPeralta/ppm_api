import { Test, TestingModule } from '@nestjs/testing';
import { LicoesAprendidasService } from './licoes-aprendidas.service';

describe('LicoesAprendidasService', () => {
  let service: LicoesAprendidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicoesAprendidasService],
    }).compile();

    service = module.get<LicoesAprendidasService>(LicoesAprendidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
