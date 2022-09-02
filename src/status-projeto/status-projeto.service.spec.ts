import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { StatusProjetoService } from './status-projeto.service';

describe('StatusProjetoService', () => {
  let service: StatusProjetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusProjetoService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<StatusProjetoService>(StatusProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
