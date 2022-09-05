import { Injectable } from '@nestjs/common';
import { SaveCampoDto } from '../dto/save-campo.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CampoEntity } from '../entities/campo.entity';

@Injectable()
export class CampoRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<CampoEntity> {
    return await this.prisma.campo.findFirstOrThrow({
      where: { id },
    });
  }

  async save(campo: SaveCampoDto) {
    return await this.prisma.campo.create({ data: campo });
  }

  async camposList() {
    return await this.prisma.campo.findMany();
  }
}
