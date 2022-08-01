import { Module } from '@nestjs/common';
import { ComplexidadeService } from './complexidade.service';
import { ComplexidadeController } from './complexidade.controller';

@Module({
  controllers: [ComplexidadeController],
  providers: [ComplexidadeService]
})
export class ComplexidadeModule {}
