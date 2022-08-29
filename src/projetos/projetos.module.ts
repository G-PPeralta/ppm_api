import { Module } from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { ResponsavelService } from 'responsavel/responsavel.service';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetosController],
  providers: [ProjetosService, ResponsavelService],
  exports: [ProjetosService],
})
export class ProjetosModule {}
