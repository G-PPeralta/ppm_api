import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AtividadesNotasController } from './atividades-notas.controller';
import { AtividadesNotasService } from './atividades-notas.service';

@Module({
  imports: [PrismaModule],
  controllers: [AtividadesNotasController],
  providers: [AtividadesNotasService],
})
export class AtividadesNotasModule {}
