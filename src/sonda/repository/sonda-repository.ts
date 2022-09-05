import { Injectable } from '@nestjs/common';
import { SondaEntity } from '../entities/sonda.entity';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SaveSondaDto } from 'sonda/dto/save-sonda.dto';

@Injectable()
export class SondaRepository {
  constructor(private prisma: PrismaService) {}

  async getOneOrFail(id: number): Promise<SondaEntity> {
    return await this.prisma.sonda.findFirstOrThrow({
      where: { id },
    });
  }

  async save(sonda: SaveSondaDto) {
    return await this.prisma.sonda.create({ data: sonda });
  }

  async sondasList() {
    return await this.prisma.sonda.findMany();
  }
}
