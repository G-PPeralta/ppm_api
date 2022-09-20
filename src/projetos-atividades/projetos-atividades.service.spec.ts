import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesService } from './projetos-atividades.service';

describe('ProjetosAtividadesService', () => {
  let service: ProjetosAtividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosAtividadesService],
    }).compile();

    service = module.get<ProjetosAtividadesService>(ProjetosAtividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
