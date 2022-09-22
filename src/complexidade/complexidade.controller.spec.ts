import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ComplexidadeController } from './complexidade.controller';
import { ComplexidadeService } from './complexidade.service';

describe('ComplexidadeController', () => {
  let controller: ComplexidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplexidadeController],
      providers: [ComplexidadeService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<ComplexidadeController>(ComplexidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
