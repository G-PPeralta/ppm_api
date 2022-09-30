import { Module } from '@nestjs/common';
import { AtividadeServicosService } from './atividade-servicos.service';
import { AtividadeServicosController } from './atividade-servicos.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AtividadeServicosController],
  providers: [AtividadeServicosService],
})
export class AtividadeServicosModule {}
