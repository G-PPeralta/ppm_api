import { Test, TestingModule } from '@nestjs/testing';
import { NovaAtividadeController } from './nova-atividade.controller';

describe('NovaAtividadeController', () => {
  let controller: NovaAtividadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NovaAtividadeController],
    }).compile();

    controller = module.get<NovaAtividadeController>(NovaAtividadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
