import { Test, TestingModule } from '@nestjs/testing';
import { EditarAtividadeController } from './editar-atividade.controller';

describe('EditarAtividadeController', () => {
  let controller: EditarAtividadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditarAtividadeController],
    }).compile();

    controller = module.get<EditarAtividadeController>(
      EditarAtividadeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
