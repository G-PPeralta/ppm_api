import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateAtividadeFerramentaDto } from './dto/create-atividade-ferramenta.dto';

@Injectable()
export class AtividadeFerramentasService {
  constructor(private prisma: PrismaService) {}

  public create = async (dto: CreateAtividadeFerramentaDto) => {
    const dataHora = new Date(dto.data_hora);
    const data: any[] = await this.prisma.$queryRawUnsafe(`
      insert into tb_atividade_ferramentas(atividade_id, nome, data_hora, anotacoes)
      values (${dto.atividade_id}, '${
      dto.nome
    }', '${dataHora.toISOString()}', '${dto.anotacoes ? dto.anotacoes : ''}')
      returning id
    `);

    return data;
  };

  public findAll = async () => {
    return await this.prisma.$queryRawUnsafe(
      'select * from tb_atividade_ferramentas',
    );
  };
}