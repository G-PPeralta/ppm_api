import { Module } from '@nestjs/common';
import { PoloService } from './polo.service';
import { PoloController } from './polo.controller';

@Module({
  controllers: [PoloController],
  providers: [PoloService],
})
export class PoloModule {}
