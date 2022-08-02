import { Test, TestingModule } from '@nestjs/testing';
import { TipoResponsavelController } from './tipo-responsavel.controller';
import { TipoResponsavelService } from './tipo-responsavel.service';

describe('TipoResponsavelController', () => {
  let controller: TipoResponsavelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoResponsavelController],
      providers: [TipoResponsavelService],
    }).compile();

    controller = module.get<TipoResponsavelController>(
      TipoResponsavelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
