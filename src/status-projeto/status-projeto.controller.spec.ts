import { Test, TestingModule } from '@nestjs/testing';
import { StatusProjetoController } from './status-projeto.controller';
import { StatusProjetoService } from './status-projeto.service';

describe('StatusProjetoController', () => {
  let controller: StatusProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusProjetoController],
      providers: [StatusProjetoService],
    }).compile();

    controller = module.get<StatusProjetoController>(StatusProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
