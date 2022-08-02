import { Module } from '@nestjs/common';
import { TipoResponsavelService } from './tipo-responsavel.service';
import { TipoResponsavelController } from './tipo-responsavel.controller';

@Module({
  controllers: [TipoResponsavelController],
  providers: [TipoResponsavelService],
})
export class TipoResponsavelModule {}
