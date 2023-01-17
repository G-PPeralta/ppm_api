/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: SERVIÇO DE CRIAÇÃO E LISTAGEM DE SOLICITANTES DE UM PROJETO.
 * DIZ RESPEITO A QUAL ÁREA DA ORIGEM ESTÁ SOLICITANDO UM PROJETO QUE ESTÁ SENDO CADASTRADO
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';

@Injectable()
export class SolicitanteService {
  constructor(private prisma: PrismaService) {}

  async create(createSolicitanteDto: CreateSolicitanteDto) {
    await this.prisma.$queryRawUnsafe(`

      INSERT INTO tb_solicitantes_projetos (solicitante, deletado)
      VALUES
      ('${createSolicitanteDto.solicitante}', false)
      ON CONFLICT (solicitante)
      DO update SET solicitante = '${createSolicitanteDto.solicitante}', deletado=false

`);
  }

  async findAll() {
    const solicitante = await this.prisma.solicitanteProjeto.findMany({
      where: {
        deletado: false,
      },
    });
    if (!solicitante) throw new Error('Falha na listagem de solicitantes');
    return solicitante;
  }
}
