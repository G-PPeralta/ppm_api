import { Test, TestingModule } from '@nestjs/testing';
import { TipoProjetoController } from './tipo-projeto.controller';
import { TipoProjetoService } from './tipo-projeto.service';

describe('TipoProjetoController', () => {
  let controller: TipoProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoProjetoController],
      providers: [TipoProjetoService],
    }).compile();

    controller = module.get<TipoProjetoController>(TipoProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
