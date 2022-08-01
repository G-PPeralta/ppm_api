import { Module } from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { ResponsavelService } from 'responsavel/responsavel.service';

@Module({
  controllers: [ProjetosController],
  providers: [ProjetosService, ResponsavelService],
  exports: [ProjetosService],
})
export class ProjetosModule {}
