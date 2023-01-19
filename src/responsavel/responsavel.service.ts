/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Serviço de criação e listagem de responsáveis de um projeto.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
@Injectable()
export class ResponsavelService {
  constructor(private prisma: PrismaService) {}

  async create(responsavel: CreateResponsavelDto) {
    //ind_sistema é uma coluna da tabela de responsáveis que indica o tipo de projeto/área pelo qual a pessoa responde. Por exemplo, ind_sistema = 'p' indica projeto, já ind_sistema = 'i', indica que é um responsável por projeto de intervenção

    return await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_responsaveis (nome_responsavel, ind_sistema) values ('${responsavel.nome}', '${responsavel.ind_sistema}')
    `);
  }

  async findAll() {
    const responsaveis = await this.prisma.responsavel.findMany();
    if (!responsaveis) throw new Error('Falha na listagem de projetos');
    return responsaveis;
  }

  async findAllProjetos(tipo: string) {
    return await this.prisma.$queryRawUnsafe(`
    select nome_responsavel as nome, responsavel_id as id from tb_responsaveis where ind_sistema='${tipo}' and dat_usu_erase is null
   `);
  }

  async findByName(nome: string) {
    const responsavel = await this.prisma.responsavel.findFirst({
      where: {
        nome,
      },
    });
    return responsavel;
  }
}
