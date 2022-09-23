import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}
  create(_createBudgetDto: CreateBudgetDto) {
    return 'This action adds a new budget';
  }

  async findAll() {
    const pais: any[] = await this.prisma
      .$queryRawUnsafe(`select planejado.id as id_planejado,
    realizado.id as id_realizado,
    planejado.id_atividade as id_campanha,
    atividades.nom_atividade as nom_campanha,
    planejado.vlr_planejado,
    realizado.vlr_realizado,
    ROUND(((realizado.vlr_realizado/planejado.vlr_planejado)* 100), 0) as gap,
    planejado.txt_observacao as observacao_planejada,
    realizado.txt_observacao as observacao_realizado
    from dev.tb_projetos_atividade_custo_plan planejado
    inner join dev.tb_projetos_atividade_custo_real realizado
    on (realizado.id_atividade = planejado.id_atividade)
    inner join dev.tb_camp_atv_campanha atividades
    on (atividades.id = planejado.id_atividade)    
    `);

    const result = pais.map(async (pai, Pkey) => {
      const filhos: any[] = await this.prisma
        .$queryRawUnsafe(`select planejado.id as id_planejado,
        realizado.id as id_realizado,
        planejado.id_atividade as id_campanha,
        atividades.id as id_filho,
        atividades.nom_atividade as nom_atividade,
        planejado.vlr_planejado,
        realizado.vlr_realizado,
        ROUND(((realizado.vlr_realizado/planejado.vlr_planejado)* 100), 0) as gap,
        planejado.txt_observacao as observacao_planejada,
        realizado.txt_observacao as observacao_realizado
        from dev.tb_projetos_atividade_custo_plan planejado
        inner join dev.tb_projetos_atividade_custo_real realizado
        on (realizado.id_atividade = planejado.id_atividade)
        inner join dev.tb_camp_atv_campanha atividades
        on (atividades.id_pai = planejado.id_atividade)
     `);

      return {
        id: pai.id_campanha,
        item: `${++Pkey}`,
        projeto: {
          id: pai.id_campanha,
          nome: pai.nom_campanha,
        },
        planejado: pai.vlr_planejado,
        realizado: pai.vlr_realizado,
        gap: pai.gap,
        descricao: pai.observacao_planejada + pai.dobservacao_realizado,
        filhos: filhos.map((filho, Fkey) => {
          return {
            id: filho.id_filho,
            item: `${Pkey}.${++Fkey}`,
            projeto: {
              id: filho.id_campanha,
              nome: filho.nom_atividade,
            },
            planejado: filho.vlr_planejado,
            realizado: pai.vlr_realizado,
            gap: filho.gap,
            descricao: filho.observacao_planejada + filho.dobservacao_realizado,
          };
        }),
      };
    });

    return await Promise.all(result);
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  async update(id: number, campo: string, valor: string) {
    const existe = await this.prisma.$queryRawUnsafe(`
    select CAST(count(*) AS INT) as qt from tb_camp_atv_campanha where id = ${id} and dat_ini_real is null;
    `);
    if (existe) {
      await this.prisma.$queryRawUnsafe(`
        UPDATE tb_camp_atv_campanha SET ${campo} = ${
        !isNaN(+valor) ? valor : "'" + valor + "'"
      }
      where id = ${id}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
