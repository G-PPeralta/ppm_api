import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';

@Module({
  providers: [],
  controllers: [PdfController],
})
export class PdfModule {}
