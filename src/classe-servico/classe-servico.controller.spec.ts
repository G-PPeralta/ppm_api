import { Test, TestingModule } from '@nestjs/testing';
import { ClasseServicoController } from './classe-servico.controller';

describe('ClasseServicoController', () => {
  let controller: ClasseServicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClasseServicoController],
    }).compile();

    controller = module.get<ClasseServicoController>(ClasseServicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
