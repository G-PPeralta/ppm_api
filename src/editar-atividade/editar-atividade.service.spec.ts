import { Test, TestingModule } from '@nestjs/testing';
import { EditarAtividadeService } from './editar-atividade.service';

describe('EditarAtividadeService', () => {
  let service: EditarAtividadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditarAtividadeService],
    }).compile();

    service = module.get<EditarAtividadeService>(EditarAtividadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
