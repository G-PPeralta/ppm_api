import { Module } from '@nestjs/common';
import { AtividadeFerramentasService } from './atividade-ferramentas.service';
import { AtividadeFerramentasController } from './atividade-ferramentas.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AtividadeFerramentasController],
  providers: [AtividadeFerramentasService],
})
export class AtividadeFerramentasModule {}
