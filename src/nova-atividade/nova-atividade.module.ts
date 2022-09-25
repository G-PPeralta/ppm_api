import { Module } from '@nestjs/common';
import { NovaAtividadeService } from './nova-atividade.service';
import { NovaAtividadeController } from './nova-atividade.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NovaAtividadeService],
  controllers: [NovaAtividadeController],
})
export class NovaAtividadeModule {}
