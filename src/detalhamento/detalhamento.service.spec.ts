import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { DetalhamentoService } from './detalhamento.service';

describe('DetalhamentoService', () => {
  let service: DetalhamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalhamentoService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<DetalhamentoService>(DetalhamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
