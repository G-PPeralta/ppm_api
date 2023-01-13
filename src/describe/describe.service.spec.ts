import { Test, TestingModule } from '@nestjs/testing';
import { DescribeService } from './describe.service';

describe('DescribeService', () => {
  let service: DescribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DescribeService],
    }).compile();

    service = module.get<DescribeService>(DescribeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
