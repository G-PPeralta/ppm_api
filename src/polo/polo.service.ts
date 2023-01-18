/**
 *  CRIADO EM: 02/08/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Service de manipulçao de polos.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreatePoloDto } from './dto/create-polo.dto';

@Injectable()
export class PoloService {
  constructor(private prisma: PrismaService) {}
  async create(createPoloDto: CreatePoloDto) {
    await this.prisma.$queryRawUnsafe(`  
      INSERT INTO tb_polos (polo, deletado)
      values
            ('${createPoloDto.polo}', false)
            on conflict (polo)
            do update set polo = '${createPoloDto.polo}', deletado=false
      `);
  }

  findAll() {
    const polos = this.prisma.polo.findMany({
      where: {
        deletado: false,
      },
    });
    if (!polos) throw new Error('Falha na listagem de polos');
    return polos;
  }
}
