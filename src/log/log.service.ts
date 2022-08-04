import { Prisma } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { prismaClient } from 'index.prisma';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  static errors = {
    noProperty:
      'Não pode enviar propriedades vazias para o Log. Verifique se a rota está recebendo um usuário autenticado',
    methodGet: 'Método do tipo GET não é enviado para o Log, retire da rota!',
    invalidDate: 'Data no formato inválido',
    invalidLimit: 'Limite no formato inválido',
  };

  static async create(createLogDto: CreateLogDto) {
    return await prismaClient.$executeRaw`call post_tb_logs(${Prisma.sql`${createLogDto}`})`;
  }

  findAll() {
    return prismaClient.log.findMany();
  }

  findOne(id: number) {
    return prismaClient.log.findUnique({ where: { id } });
  }

  async getLogsFiltered(dt_inicio?: string, dt_fim?: string, limit?: number) {
    const dtInicioIsValid = !isNaN(new Date(dt_inicio).getDate()) || !dt_inicio;
    const dtFimIsValid = !isNaN(new Date(dt_fim).getDate()) || !dt_fim;
    const limitIsValid = !!Number(limit) || !limit;

    if (!dtInicioIsValid || !dtFimIsValid || !limitIsValid) {
      const message =
        !dtInicioIsValid || !dtFimIsValid
          ? LogService.errors.invalidDate
          : LogService.errors.invalidLimit;

      throw new InternalServerErrorException(message);
    }

    const esse =
      await prismaClient.$queryRaw`select * from dev.f_get_log_filtered(${Prisma.sql`${dt_inicio},${dt_fim},${limit}::int)`}`;

    return esse;
  }
}
