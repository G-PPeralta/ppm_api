import { Body, Controller, Delete, Post } from '@nestjs/common';
import { S3DeletePayload } from './dto/s3delete.dto';
import { S3UploadPayload } from './dto/s3upload.dto';
import { S3Service } from './s3.service';

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
