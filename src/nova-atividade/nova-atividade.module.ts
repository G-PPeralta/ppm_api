import { Module } from '@nestjs/common';
import { NovaAtividadeService } from './nova-atividade.service';
import { NovaAtividadeController } from './nova-atividade.controller';
import { PrismaModule } from 'services/prisma/prisma.module';
import { CampanhaModule } from 'campanha/campanha.module';

@Module({
  imports: [PrismaModule, CampanhaModule],
  providers: [NovaAtividadeService],
  controllers: [NovaAtividadeController],
})
export class NovaAtividadeModule {}
