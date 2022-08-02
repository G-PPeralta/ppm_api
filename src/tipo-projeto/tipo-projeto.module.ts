import { Module } from '@nestjs/common';
import { TipoProjetoService } from './tipo-projeto.service';
import { TipoProjetoController } from './tipo-projeto.controller';

@Module({
  controllers: [TipoProjetoController],
  providers: [TipoProjetoService],
})
export class TipoProjetoModule {}
