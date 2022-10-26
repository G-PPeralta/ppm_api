import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateNovaOperacao } from './dto/create-nova-operacao.dto';
import { CreatePoco } from './dto/create-poco.dto';
import { CreateSonda } from './dto/create-sonda.dto';

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
         ${null}, ${null},
         ${null}, ${null}, false, '${createNovaOperacao.nom_usu_create}', NOW()
         )
    `);
  }

  async findAll() {
    return await this.prisma.$queryRawUnsafe(`
        SELECT 
        *, 
        (select 
        case when sum(fn_hrs_totais_cronograma_atvv(dat_ini_real, dat_fim_real)) is not null then
            sum(fn_hrs_totais_cronograma_atvv(dat_ini_real, dat_fim_real)) 
        else
            0
        end as hrs_totais
        from tb_projetos_atividade where nom_atividade = a.nom_operacao) 
      FROM tb_projetos_operacao a 
    `);
  }

  async createPoco(createPoco: CreatePoco) {
    await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos_poco (poco)
      VALUES ('${createPoco.poco}')
    `);
  }

  async findPoco() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT * FROM tb_projetos_poco
    `);
  }

  async createSonda(createSonda: CreateSonda) {
    await this.prisma.$queryRawUnsafe(`
      INSERT INTO tb_projetos (nome_projeto, polo_id, local_id, tipo_projeto_id, status_id)
      VALUES ('${createSonda.nome}', 1, 4, 3, 1)
    `);
  }

  async findSonda() {
    return await this.prisma.$queryRawUnsafe(`
      SELECT id, nome_projeto as sonda FROM tb_projetos
    `);
  }
}
