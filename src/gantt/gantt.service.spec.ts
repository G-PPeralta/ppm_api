import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { GanttService } from './gantt.service';

describe('GanttService', () => {
  let service: GanttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GanttService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<GanttService>(GanttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
