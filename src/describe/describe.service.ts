import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class DescribeService {
  constructor(private prisma: PrismaService) {}

  async describeTable(table: string) {
    return await this.prisma.$queryRawUnsafe(`
            SELECT fn_describe_table_as_json('${table}')
        `);
  }
}
