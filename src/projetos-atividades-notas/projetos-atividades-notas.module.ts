import { Module } from '@nestjs/common';
import { ProjetosAtividadesNotasService } from './projetos-atividades-notas.service';
import { ProjetosAtividadesNotasController } from './projetos-atividades-notas.controller';

@Module({
  providers: [ProjetosAtividadesNotasService],
  controllers: [ProjetosAtividadesNotasController],
})
export class ProjetosAtividadesNotasModule {}
