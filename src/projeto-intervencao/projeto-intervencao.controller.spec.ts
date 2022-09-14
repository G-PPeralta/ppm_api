import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoIntervencaoController } from './projeto-intervencao.controller';
import { ProjetoIntervencaoService } from './projeto-intervencao.service';

describe('ProjetoIntervencaoController', () => {
  let controller: ProjetoIntervencaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetoIntervencaoController],
      providers: [ProjetoIntervencaoService],
    }).compile();

    controller = module.get<ProjetoIntervencaoController>(
      ProjetoIntervencaoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
