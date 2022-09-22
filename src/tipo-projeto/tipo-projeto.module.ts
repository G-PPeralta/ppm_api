import { Module } from '@nestjs/common';
import { TipoProjetoService } from './tipo-projeto.service';
import { TipoProjetoController } from './tipo-projeto.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoProjetoController],
  providers: [TipoProjetoService],
})
export class TipoProjetoModule {}
