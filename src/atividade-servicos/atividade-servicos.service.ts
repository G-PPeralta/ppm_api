import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadeServicoDto } from './dto/create-atividade-servico.dto';

@Injectable()
export class AtividadeServicosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAtividadeServicoDto) {
    const data: any[] = await this.prisma.$queryRawUnsafe(`
      insert into tb_atividade_servicos(atividade_id, nome, data_hora, anotacoes)
      values (${dto.atividade_id}, '${dto.nome}', '${dto.data} ${dto.hora}', '${
      dto.anotacoes ? dto.anotacoes : ''
    }')
      returning id
    `);

    return data;
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(
      'select * from tb_atividade_servicos',
    );
  }
}
