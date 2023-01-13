import { Test, TestingModule } from '@nestjs/testing';
import { DescribeController } from './describe.controller';

describe('DescribeController', () => {
  let controller: DescribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DescribeController],
    }).compile();

    controller = module.get<DescribeController>(DescribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
