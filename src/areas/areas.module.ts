import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';

@Module({
  imports: [PrismaModule],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
