import { Module } from '@nestjs/common';
import { DetalhamentoService } from './detalhamento.service';
import { DetalhamentoController } from './detalhamento.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetalhamentoController],
  providers: [DetalhamentoService],
})
export class DetalhamentoModule {}
