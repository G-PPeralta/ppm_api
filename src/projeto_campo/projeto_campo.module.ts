import { Module } from '@nestjs/common';
import { ProjetoCampoService } from './projeto_campo.service';
import { ProjetoCampoController } from './projeto_campo.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetoCampoController],
  providers: [ProjetoCampoService],
})
export class ProjetoCampoModule {}
