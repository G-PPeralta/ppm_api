import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { GanttController } from './gantt.controller';
import { GanttService } from './gantt.service';

describe('GanttController', () => {
  let controller: GanttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GanttController],
      providers: [GanttService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<GanttController>(GanttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
