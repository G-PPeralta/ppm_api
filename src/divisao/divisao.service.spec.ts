import { Test, TestingModule } from '@nestjs/testing';
import { DivisaoService } from './divisao.service';

describe('DivisaoService', () => {
  let service: DivisaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisaoService],
    }).compile();

    service = module.get<DivisaoService>(DivisaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
