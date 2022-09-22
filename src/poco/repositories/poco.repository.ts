import { Injectable } from '@nestjs/common';
import { PocoEntity } from '../entities/poco.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SavePocoDto } from '../dto/save-poco.dto';

@Injectable()
export class PocoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<PocoEntity> {
    return await this.prisma.poco.findFirstOrThrow({
      where: { id },
    });
  }

  async save(poco: SavePocoDto) {
    return await this.prisma.poco.create({ data: poco });
  }

  async intervencoesList() {
    return await this.prisma.poco.findMany();
  }
}
