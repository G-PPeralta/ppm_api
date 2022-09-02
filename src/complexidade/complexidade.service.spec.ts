import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ComplexidadeService } from './complexidade.service';

describe('ComplexidadeService', () => {
  let service: ComplexidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplexidadeService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<ComplexidadeService>(ComplexidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
