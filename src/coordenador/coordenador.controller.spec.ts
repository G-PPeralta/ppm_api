import { Test, TestingModule } from '@nestjs/testing';
import { CoordenadorController } from './coordenador.controller';
import { CoordenadorService } from './coordenador.service';

describe('CoordenadorController', () => {
  let controller: CoordenadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordenadorController],
      providers: [CoordenadorService],
    }).compile();

    controller = module.get<CoordenadorController>(CoordenadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
