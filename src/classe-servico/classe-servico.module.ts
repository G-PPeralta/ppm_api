import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ClasseServicoController } from './classe-servico.controller';
import { ClasseServicoService } from './classe-servico.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClasseServicoController],
  providers: [ClasseServicoService],
})
export class ClasseServicoModule {}
