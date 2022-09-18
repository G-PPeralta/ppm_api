import { Module } from '@nestjs/common';
import { ProjetosAtividadesService } from './projetos-atividades.service';
import { ProjetosAtividadesController } from './projetos-atividades.controller';

@Module({
  providers: [ProjetosAtividadesService],
  controllers: [ProjetosAtividadesController],
})
export class ProjetosAtividadesModule {}
