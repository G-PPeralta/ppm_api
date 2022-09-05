import { Injectable } from '@nestjs/common';
import { SavePoloDto } from '../dto/save-polo.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PoloEntity } from '../entities/polo.entity';

@Injectable()
export class PoloRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<PoloEntity> {
    return await this.prisma.polo.findFirstOrThrow({
      where: { id },
    });
  }

  async save(campo: SavePoloDto) {
    return await this.prisma.polo.create({ data: campo });
  }

  async camposList() {
    return await this.prisma.polo.findMany();
  }
}
