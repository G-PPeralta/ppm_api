import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateNovaOperacao } from './dto/create-nova-operacao.dto';

@Injectable()
export class NovaOperacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createNovaOperacao: CreateNovaOperacao) {
    await this.prisma.$queryRawUnsafe(`
        INSERT INTO tb_projetos_operacao 
        (id_origem, nom_operacao, responsavel_id, area_id, nao_iniciar_antes_de, nao_terminar_depois_de, o_mais_breve_possivel, nom_usu_create, dat_usu_create)
        VALUES
        ('${createNovaOperacao.id_origem}', '${
      createNovaOperacao.nom_operacao
    }',
         ${createNovaOperacao.responsavel_id}, ${createNovaOperacao.area_id},
         ${null}, ${null}, false, '${createNovaOperacao.nom_usu_create}', NOW()
         )
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_operacao
    `);
  }
}
