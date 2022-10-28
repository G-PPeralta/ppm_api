import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosFinanceiroController } from './projetos-financeiro.controller';

describe('ProjetosFinanceiroController', () => {
  let controller: ProjetosFinanceiroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosFinanceiroController],
    }).compile();

    controller = module.get<ProjetosFinanceiroController>(
      ProjetosFinanceiroController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
