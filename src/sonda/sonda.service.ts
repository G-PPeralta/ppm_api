import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateSondaDto } from './dto/create-sonda.dto';
import { UpdateSondaDto } from './dto/update-sonda.dto';

@Injectable()
export class SondaService {
  constructor(private prisma: PrismaService) {}
  create(createSondaDto: CreateSondaDto) {
    const spt = this.prisma.sonda.create({ data: createSondaDto });
    return spt;
  }

  findAll() {
    return this.prisma.$queryRawUnsafe(`
    SELECT id, nom_sonda
FROM dev.tb_sondas
where dat_usu_erase is null;
    `);
  }

  findOne(id: number) {
    const spt = this.prisma.sonda.findUnique({ where: { id } });
    return spt;
  }

  update(id: number, updateSondaDto: UpdateSondaDto) {
    return this.prisma.sonda.update({
      where: { id: id },
      data: { nome: updateSondaDto.nome },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} sonda`;
  }
}
