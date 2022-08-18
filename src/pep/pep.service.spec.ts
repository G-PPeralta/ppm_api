import { Test, TestingModule } from '@nestjs/testing';
import { PepService } from './pep.service';

describe('PepService', () => {
  let service: PepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PepService],
    }).compile();

    service = module.get<PepService>(PepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
