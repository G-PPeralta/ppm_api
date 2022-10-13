import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ProjetosFinanceiroController } from './projetos-financeiro.controller';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetosFinanceiroController],
  providers: [ProjetosFinanceiroService],
})
export class ProjetosFinanceiroModule {}
