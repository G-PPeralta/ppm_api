import { Module } from '@nestjs/common';
import { AtividadesProjetosService } from './atividades-projetos.service';
import { AtividadesProjetosController } from './atividades-projetos.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AtividadesProjetosController],
  providers: [AtividadesProjetosService],
})
export class AtividadesProjetosModule {}
