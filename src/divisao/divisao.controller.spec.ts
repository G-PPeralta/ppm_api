import { Test, TestingModule } from '@nestjs/testing';
import { DivisaoController } from './divisao.controller';
import { DivisaoService } from './divisao.service';

describe('DivisaoController', () => {
  let controller: DivisaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivisaoController],
      providers: [DivisaoService],
    }).compile();

    controller = module.get<DivisaoController>(DivisaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
