import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateSondaDto } from './dto/create-sonda.dto';
import { UpdateSondaDto } from './dto/update-sonda.dto';

@Injectable()
export class SondaService {
  constructor(private prisma: PrismaService) {}
  async create(createSondaDto: CreateSondaDto) {
    return await this.prisma.$queryRawUnsafe(`
    INSERT INTO tb_sondas (nom_sonda, nom_usu_create, dat_usu_create)
    VALUES ('${createSondaDto.nome}', '${createSondaDto.nom_usu_create}', now())
    RETURNING id
    `);
  }

  findAll() {
    return this.prisma.$queryRawUnsafe(`
    SELECT id, nom_sonda
FROM tb_sondas
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
    return this.prisma.$queryRawUnsafe(`
   UPDATE tb_sondas set dat_usu_erase = now()
    WHERE id = ${id};
   `);
  }
}
