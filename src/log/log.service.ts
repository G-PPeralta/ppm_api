import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  static errors = {
    noProperty:
      'Não pode enviar propriedades vazias para o Log. Verifique se a rota está recebendo um usuário autenticado',
    methodGet: 'Método do tipo GET não é enviado para o Log, retire da rota!',
  };

  static async create(createLogDto: CreateLogDto) {
    return await prismaClient.$executeRaw`call dev.post_tb_logs(${Prisma.sql`${createLogDto}`})`;
  }

  findAll() {
    return prismaClient.log.findMany();
  }

  findOne(id: number) {
    return prismaClient.log.findUnique({ where: { id } });
  }
}
