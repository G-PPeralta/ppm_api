import { Module } from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ResponsavelModule } from '../responsavel/responsavel.module';

@Module({
  imports: [ResponsavelModule, PrismaModule],
  controllers: [ProjetosController],
  providers: [ProjetosService],
  exports: [ProjetosService],
})
export class ProjetosModule {}
