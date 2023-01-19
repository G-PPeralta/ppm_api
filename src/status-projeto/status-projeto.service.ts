/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: SERVIÇO DE CRIAÇÃO E LISTAGEM DE STATUS DE UM PROJETO.
 * O STATUS DE UM PROJETO É INFORMADO NA TELA DE CADASTRO DE UM PROJETO
 * ESSAS ROTAS SÃO USADAS PARA ABASTECER AS OPTIONS DE UM SELECT, QUE FARÁ PARTE
 * DO PAYLOAD DO CADASTRO DE UM PROJETO
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateStatusProjetoDto } from './dto/create-status-projeto.dto';

@Injectable()
export class StatusProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createStatusProjetoDto: CreateStatusProjetoDto) {
    return await this.prisma.statusProjeto.create({
      data: createStatusProjetoDto,
    });
  }

  async findAll() {
    return await this.prisma.statusProjeto.findMany({
      where: { deletado: false },
    });
  }
}
