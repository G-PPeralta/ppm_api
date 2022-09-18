import { Module } from '@nestjs/common';
import { ProjetosAtividadesLicoesAprendidasController } from './projetos-atividades-licoes-aprendidas.controller';
import { ProjetosAtividadesLicoesAprendidasService } from './projetos-atividades-licoes-aprendidas.service';

@Module({
  controllers: [ProjetosAtividadesLicoesAprendidasController],
  providers: [ProjetosAtividadesLicoesAprendidasService],
})
export class ProjetosAtividadesLicoesAprendidasModule {}
