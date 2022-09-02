import { Module } from '@nestjs/common';
import { DetalhamentoService } from './detalhamento.service';
import { DetalhamentoController } from './detalhamento.controller';

@Module({
  controllers: [DetalhamentoController],
  providers: [DetalhamentoService],
})
export class DetalhamentoModule {}
