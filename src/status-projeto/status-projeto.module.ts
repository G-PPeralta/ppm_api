import { Module } from '@nestjs/common';
import { StatusProjetoService } from './status-projeto.service';
import { StatusProjetoController } from './status-projeto.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StatusProjetoController],
  providers: [StatusProjetoService],
})
export class StatusProjetoModule {}
