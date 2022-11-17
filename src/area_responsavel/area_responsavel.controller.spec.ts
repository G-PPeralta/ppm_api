import { Test, TestingModule } from '@nestjs/testing';
import { AreaResponsavelController } from './area_responsavel.controller';

describe('AreaResponsavelController', () => {
  let controller: AreaResponsavelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaResponsavelController],
    }).compile();

    controller = module.get<AreaResponsavelController>(
      AreaResponsavelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
