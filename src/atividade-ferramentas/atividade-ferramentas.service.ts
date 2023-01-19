/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a ferramentas utilizadas para uma atividade
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadeFerramentaDto } from './dto/create-atividade-ferramenta.dto';

@Injectable()
export class AtividadeFerramentasService {
  constructor(private prisma: PrismaService) {}

  public create = async (dto: CreateAtividadeFerramentaDto) => {
    const data: any[] = await this.prisma.$queryRawUnsafe(`
      insert into tb_atividade_ferramentas(atividade_id, nome, data_hora, anotacoes)
      values (${dto.atividade_id}, '${dto.nome}', '${dto.data} ${dto.hora}', '${
      dto.anotacoes ? dto.anotacoes : ''
    }')
      returning id
    `);

    return data;
  };

  public findById = async (id: number) => {
    const ferramentas = await this.prisma.$queryRawUnsafe(
      `select * from tb_atividade_ferramentas where atividade_id = ${id}`,
    );
    return ferramentas;
  };
}
