import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesRecursosService } from './projetos-atividades-recursos.service';

describe('ProjetosAtividadesRecursosService', () => {
  let service: ProjetosAtividadesRecursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosAtividadesRecursosService],
    }).compile();

    service = module.get<ProjetosAtividadesRecursosService>(
      ProjetosAtividadesRecursosService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
