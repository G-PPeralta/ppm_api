import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { CampanhaProjetoTipoController } from './campanha-projeto-tipo.controller';
import { CampanhaProjetoTipoService } from './campanha-projeto-tipo.service';

@Module({
  imports: [PrismaModule],
  controllers: [CampanhaProjetoTipoController],
  providers: [CampanhaProjetoTipoService],
})
export class CampanhaProjetoTipoModule {}
