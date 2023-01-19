import { Module } from '@nestjs/common';
import { PoloService } from './polo.service';
import { PoloController } from './polo.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PoloController],
  providers: [PoloService],
})
export class PoloModule {}
