import { Test, TestingModule } from '@nestjs/testing';
import { AreaResponsavelService } from './area_responsavel.service';

describe('AreaResponsavelService', () => {
  let service: AreaResponsavelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaResponsavelService],
    }).compile();

    service = module.get<AreaResponsavelService>(AreaResponsavelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
