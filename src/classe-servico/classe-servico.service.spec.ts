import { Test, TestingModule } from '@nestjs/testing';
import { ClasseServicoService } from './classe-servico.service';

describe('ClasseServicoService', () => {
  let service: ClasseServicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasseServicoService],
    }).compile();

    service = module.get<ClasseServicoService>(ClasseServicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
