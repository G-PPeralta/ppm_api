import { Test, TestingModule } from '@nestjs/testing';
import { CampanhaController } from './campanha.controller';
import { CampanhaService } from './campanha.service';

describe('CampanhaController', () => {
  let controller: CampanhaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampanhaController],
      providers: [CampanhaService],
    }).compile();

    controller = module.get<CampanhaController>(CampanhaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
