import { Test, TestingModule } from '@nestjs/testing';
import { LicoesAprendidasController } from './licoes-aprendidas.controller';

describe('LicoesAprendidasController', () => {
  let controller: LicoesAprendidasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicoesAprendidasController],
    }).compile();

    controller = module.get<LicoesAprendidasController>(
      LicoesAprendidasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
