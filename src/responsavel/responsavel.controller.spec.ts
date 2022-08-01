import { Test, TestingModule } from '@nestjs/testing';
import { ResponsavelController } from './responsavel.controller';
import { ResponsavelService } from './responsavel.service';

describe('ResponsavelController', () => {
  let controller: ResponsavelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsavelController],
      providers: [ResponsavelService],
    }).compile();

    controller = module.get<ResponsavelController>(ResponsavelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
