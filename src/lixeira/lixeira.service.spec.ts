import { Test, TestingModule } from '@nestjs/testing';
import { LixeiraService } from './lixeira.service';

describe('LixeiraService', () => {
  let service: LixeiraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LixeiraService],
    }).compile();

    service = module.get<LixeiraService>(LixeiraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
