import { Module } from '@nestjs/common';
import { StatusProjetoService } from './status-projeto.service';
import { StatusProjetoController } from './status-projeto.controller';

@Module({
  controllers: [StatusProjetoController],
  providers: [StatusProjetoService],
})
export class StatusProjetoModule {}
