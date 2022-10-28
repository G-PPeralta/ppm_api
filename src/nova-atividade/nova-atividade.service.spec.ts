import { Test, TestingModule } from '@nestjs/testing';
import { NovaAtividadeService } from './nova-atividade.service';

describe('NovaAtividadeService', () => {
  let service: NovaAtividadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NovaAtividadeService],
    }).compile();

    service = module.get<NovaAtividadeService>(NovaAtividadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
