/**
 * CRIADO EM: 31/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a tabela dinamica
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class DescribeService {
  constructor(private prisma: PrismaService) {}

  async describeTable(table: string) {
    //retorna uma descrição da tabela como JSON
    return await this.prisma.$queryRawUnsafe(`
            SELECT fn_describe_table_as_json('${table}')
        `);
  }
}
