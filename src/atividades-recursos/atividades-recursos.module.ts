import { Module } from '@nestjs/common';
import { AtividadesRecursosService } from './atividades-recursos.service';
import { AtividadesRecursosController } from './atividades-recursos.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AtividadesRecursosService],
  controllers: [AtividadesRecursosController],
})
export class AtividadesRecursosModule {}
