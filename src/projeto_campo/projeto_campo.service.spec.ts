import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoCampoService } from './projeto_campo.service';

describe('ProjetoCampoService', () => {
  let service: ProjetoCampoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetoCampoService],
    }).compile();

    service = module.get<ProjetoCampoService>(ProjetoCampoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
