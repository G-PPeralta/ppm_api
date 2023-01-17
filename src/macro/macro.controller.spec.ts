import { Test, TestingModule } from '@nestjs/testing';
import { MacroController } from './macro.controller';

describe('MacroController', () => {
  let controller: MacroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MacroController],
    }).compile();

    controller = module.get<MacroController>(MacroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
