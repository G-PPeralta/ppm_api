import { Test, TestingModule } from '@nestjs/testing';
import { ComplexidadeService } from './complexidade.service';

describe('ComplexidadeService', () => {
  let service: ComplexidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplexidadeService],
    }).compile();

    service = module.get<ComplexidadeService>(ComplexidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
