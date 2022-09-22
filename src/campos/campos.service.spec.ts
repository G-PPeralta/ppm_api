import { Test, TestingModule } from '@nestjs/testing';
import { PoloModule } from '../polo/polo.module';
import { CamposModule } from './campos.module';
import { CamposService } from './campos.service';

describe('CamposService', () => {
  let service: CamposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamposService],
      imports: [CamposModule, PoloModule],
    }).compile();

    service = module.get<CamposService>(CamposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
