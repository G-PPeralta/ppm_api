/**
 * CRIADO EM: 14/12/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: S3 É UM SERVIÇO DA AMAZON PARA UPLOAD DE ARQUIVOS, É USADO NA PARTE DE CRONOGRAMAS (INTERVENÇÕES)
 */

import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { S3DeletePayload } from './dto/s3delete.dto';
import { S3UploadPayload } from './dto/s3upload.dto';
import { S3Service } from './s3.service';

@UseGuards(JwtAuthGuard)
@Controller('s3')
export class S3Controller {
  constructor(private readonly service: S3Service) {}

  @Post()
  salvaArquivos(@Body() payload: S3UploadPayload) {
    return this.service.uploadFilesToObjectStorage(payload);
  }

  @Delete()
  deletaArquivo(@Body() payload: S3DeletePayload) {
    return this.service.deleteFileFromObjectStorage(payload.url);
  }
}
