import { Test, TestingModule } from '@nestjs/testing';
import { TipoResponsavelService } from './tipo-responsavel.service';

describe('TipoResponsavelService', () => {
  let service: TipoResponsavelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoResponsavelService],
    }).compile();

    service = module.get<TipoResponsavelService>(TipoResponsavelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
