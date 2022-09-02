import { Module } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { GanttController } from './gantt.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GanttController],
  providers: [GanttService],
})
export class GanttModule {}
