import { Test, TestingModule } from '@nestjs/testing';
import { TipoProjetoService } from './tipo-projeto.service';

describe('TipoProjetoService', () => {
  let service: TipoProjetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoProjetoService],
    }).compile();

    service = module.get<TipoProjetoService>(TipoProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
