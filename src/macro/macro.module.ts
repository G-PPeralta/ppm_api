import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { MacroController } from './macro.controller';
import { MacroService } from './macro.service';

@Module({
  imports: [PrismaModule],
  controllers: [MacroController],
  providers: [MacroService],
})
export class MacroModule {}
