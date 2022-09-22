import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';

describe('LocalController', () => {
  let controller: LocalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalController],
      providers: [LocalService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<LocalController>(LocalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
