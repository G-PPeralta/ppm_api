import { Test, TestingModule } from '@nestjs/testing';
import { GraficosController } from './graficos.controller';
import { GraficosService } from './graficos.service';

describe('GraficosController', () => {
  let controller: GraficosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraficosController],
      providers: [GraficosService],
    }).compile();

    controller = module.get<GraficosController>(GraficosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
