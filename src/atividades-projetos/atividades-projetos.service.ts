/**
 * CRIADO EM: 03/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a atividades de intervenção
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class AtividadesProjetosService {
  constructor(private prisma: PrismaService) {}

  //tabela principal, com relação de id_projeto para vinculação de todas suas atividades
  async findOne(id: number) {
    return await this.prisma
      .$queryRaw`select * from tb_projetos_atividade where id_projeto = ${id} and dat_usu_erase is null;`;
  }
}
