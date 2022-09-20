import { Module } from '@nestjs/common';
import { ProjetosAtividadesService } from './projetos-atividades.service';
import { ProjetosAtividadesController } from './projetos-atividades.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjetosAtividadesService],
  controllers: [ProjetosAtividadesController],
})
export class ProjetosAtividadesModule {}
