import { Test, TestingModule } from '@nestjs/testing';
import { ResponsavelService } from './responsavel.service';

describe('ResponsavelService', () => {
  let service: ResponsavelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsavelService],
    }).compile();

    service = module.get<ResponsavelService>(ResponsavelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
