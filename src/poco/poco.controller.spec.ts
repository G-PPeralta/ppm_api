import { Test, TestingModule } from '@nestjs/testing';
import { PocoController } from './poco.controller';
import { PocoService } from './poco.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('PocoController', () => {
  let controller: PocoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PocoController],
      providers: [PocoService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<PocoController>(PocoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
