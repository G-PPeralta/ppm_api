import { Test, TestingModule } from '@nestjs/testing';
import { CamposController } from './campos.controller';
import { CamposModule } from './campos.module';
import { CamposService } from './campos.service';

describe('CamposController', () => {
  let controller: CamposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CamposController],
      providers: [CamposService],
      imports: [CamposModule],
    }).compile();

    controller = module.get<CamposController>(CamposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
