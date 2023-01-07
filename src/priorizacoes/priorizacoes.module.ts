import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { PriorizacoesService } from './priorizacoes.service';
import { PriorizacoesController } from './priorizacoes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PriorizacoesController],
  providers: [PriorizacoesService],
  exports: [PriorizacoesService],
})
export class PriorizacoesModule {}
