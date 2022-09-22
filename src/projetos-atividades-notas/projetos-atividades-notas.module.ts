import { Module } from '@nestjs/common';
import { ProjetosAtividadesNotasService } from './projetos-atividades-notas.service';
import { ProjetosAtividadesNotasController } from './projetos-atividades-notas.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjetosAtividadesNotasService],
  controllers: [ProjetosAtividadesNotasController],
})
export class ProjetosAtividadesNotasModule {}
