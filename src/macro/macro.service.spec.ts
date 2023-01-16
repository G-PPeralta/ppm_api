import { Test, TestingModule } from '@nestjs/testing';
import { MacroService } from './macro.service';

describe('MacroService', () => {
  let service: MacroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MacroService],
    }).compile();

    service = module.get<MacroService>(MacroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
