import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ProjetosAtividadesLicoesAprendidasController } from './projetos-atividades-licoes-aprendidas.controller';
import { ProjetosAtividadesLicoesAprendidasService } from './projetos-atividades-licoes-aprendidas.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetosAtividadesLicoesAprendidasController],
  providers: [ProjetosAtividadesLicoesAprendidasService],
})
export class ProjetosAtividadesLicoesAprendidasModule {}
