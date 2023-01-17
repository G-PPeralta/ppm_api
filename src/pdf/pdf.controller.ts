/**
 *  CRIADO EM: 27/10/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a pdf.
 */

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('pdf')
export class PdfController {
  @Post('all')
  @UseInterceptors(
    FilesInterceptor('files[]', 100, {
      storage: diskStorage({
        destination: 'uploads',
        filename: function (req, file, cb) {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  salvaPdf(@UploadedFiles() files) {
    return 200;
  }

  @Post('one')
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: 'uploads',
        filename: function (req, file, cb) {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  salvaUmPdf(@UploadedFile() files) {
    return 200;
  }

  @Get(':nome_arquivo')
  getFile(@Param('nome_arquivo') nome_arquivo: string, @Res() response) {
    const file = createReadStream(`uploads/${nome_arquivo}.pdf`);
    response.set('Content-Type', 'application/pdf');
    response.set(`attachment; filename=${nome_arquivo}`);
    file.pipe(response);
  }
}
