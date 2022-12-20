import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoCampoController } from './projeto_campo.controller';
import { ProjetoCampoService } from './projeto_campo.service';

describe('ProjetoCampoController', () => {
  let controller: ProjetoCampoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetoCampoController],
      providers: [ProjetoCampoService],
    }).compile();

    controller = module.get<ProjetoCampoController>(ProjetoCampoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
