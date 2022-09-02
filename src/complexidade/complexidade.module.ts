import { Module } from '@nestjs/common';
import { ComplexidadeService } from './complexidade.service';
import { ComplexidadeController } from './complexidade.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplexidadeController],
  providers: [ComplexidadeService],
})
export class ComplexidadeModule {}
