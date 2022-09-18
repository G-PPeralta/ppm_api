import { Module } from '@nestjs/common';
import { ProjetosAtividadesRecursosController } from './projetos-atividades-recursos.controller';
import { ProjetosAtividadesRecursosService } from './projetos-atividades-recursos.service';

@Module({
  controllers: [ProjetosAtividadesRecursosController],
  providers: [ProjetosAtividadesRecursosService],
})
export class ProjetosAtividadesRecursosModule {}
