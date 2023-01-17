import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { DescribeController } from './describe.controller';
import { DescribeService } from './describe.service';

@Module({
  imports: [PrismaModule],
  controllers: [DescribeController],
  providers: [DescribeService],
})
export class DescribeModule {}
