import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  constructor(private prismaClient: PrismaService) {}

  async getProjetosDetalhados() {
    const query = `
    SELECT *,
    cpx.complexidade,
    pri.prioridade,
    pls.polo,
    crd.coordenador_nome AS coordenador,
    rsp.nome_responsavel  AS responsavel,
    vlr_orcado,
    vlr_cr,
    a.data_inicio,
    a.data_fim,
   0 AS pct,
   a.descricao,
   a.justificativa,
    case when vlr_cpi is null or vlr_cpi = 0 then
      1
    else vlr_cpi end  as vlr_cpi_corrigido,
    case when vlr_spi is null or vlr_spi = 0 then
      1
    else vlr_spi end  as vlr_spi_corrigido	
    from tb_projetos a
	 LEFT JOIN tb_complexidades cpx
	 	ON cpx.id = a.complexidade_id
	  LEFT JOIN tb_prioridades_projetos pri
    ON pri.id = a.prioridade_id
  LEFT JOIN tb_polos pls
    ON pls.id = a.polo_id
  LEFT JOIN tb_coordenadores crd
    ON crd.id_coordenador = a.coordenador_id
  LEFT JOIN tb_responsaveis rsp
    ON rsp.responsavel_id = a.responsavel_id
    left join (
      select 
            id AS id_projeto,
            trunc(case when coalesce(vlr_cr, 0) = 0 then 0 else vlr_va / vlr_cr end, 2) as vlr_cpi,
            trunc(case when coalesce(vlr_vp, 0) = 0 then 0 else vlr_va / vlr_vp end, 2) as vlr_spi,
            vlr_cr,
            valor_total_previsto AS vlr_orcado,
            data_inicio,
            data_fim,
            0 AS pct,
            descricao,
            justificativa
            from (
            select 
              id,
              (dev.fn_cron_calc_pct_plan_projeto(0, id)/100) * sum(vlr_planejado) as vlr_vp, 
              (dev.fn_cron_calc_pct_real_projeto(0, id)/100) * sum(vlr_planejado) as vlr_va,
              sum(vlr_realizado) as vlr_cr,
              valor_total_previsto,
              data_inicio,
              data_fim,
              descricao,
              justificativa,
              nome_projeto
            from (
              select 
                c.id,
                case when sum(vlr_planejado) is null 
                  then 0 
                  else sum(vlr_planejado)
                end as vlr_planejado,
                0 as vlr_realizado,
                c.valor_total_previsto,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from dev.tb_projetos_atividade_custo_plan a
              inner join dev.tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join dev.tb_projetos c
                on b.id_projeto = c.id
             
              GROUP BY
                c.id,
                c.valor_total_previsto,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              union
              select 
                c.id,
                0 as vlr_planejado,
                case when sum(vlr_realizado) is null 
                  then 0 
                  else sum(vlr_realizado)
                end as vlr_realizado,
                c.valor_total_previsto,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
              from dev.tb_projetos_atividade_custo_real a
              inner join dev.tb_projetos_atividade b
                on a.id_atividade = b.id
              inner join dev.tb_projetos c
                on b.id_projeto = c.id

              GROUP BY
                c.id,
                c.valor_total_previsto,
                c.data_inicio,
                c.data_fim,
                c.descricao,
                c.justificativa,
                c.nome_projeto
            ) as qr
            GROUP BY 
              qr.id,
              qr.valor_total_previsto,
              qr.data_inicio,
              qr.data_fim,
              qr.descricao,
              qr.justificativa,
              qr.nome_projeto
            ) as qr2
    ) as b
    on a.id = b.id_projeto
    where 
      a.tipo_projeto_id in (1,2,3)
    order by b.id_projeto asc    

    `;

    return await this.prismaClient.$queryRawUnsafe(query);
  }

  async create(createProjetoDto: CreateProjetoDto) {
    return await this.prismaClient.projeto.create({
      data: {
        ...createProjetoDto,
        dataFim: new Date(createProjetoDto.dataFim),
        dataFimReal: new Date(createProjetoDto.dataFimReal),
        dataInicio: new Date(createProjetoDto.dataInicio),
        dataInicioReal: new Date(createProjetoDto.dataInicioReal),
      },
    });
  }

  async findAllProjetosPrazos() {
    return this.prismaClient.$queryRawUnsafe(`
    select 
      *,
      '' as nome_responsavel,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  order by id_pai asc, dat_ini_plan asc;`);
  }

  async findProjetosPrazos(id: number) {
    return this.prismaClient.$queryRawUnsafe(`    
   select 
      *,
      '' as nome_responsavel,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  where id_projeto = ${id}
  order by id_pai asc, dat_ini_plan asc;
    `);
  }

  async findProjetosPercentuais(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select 
    *,
    round(dev.fn_cron_calc_pct_plan(b.id),1) as pct_plan,
    round(dev.fn_cron_calc_pct_real(b.id),1) as pct_real
from dev.tb_projetos a
left join dev.tb_projetos_atividade b 
    on a.id = b.id_projeto 
where 
    b.id_pai = 0 or b.id_pai is null
and a.id = ${id};
`);
  }

  async findAll() {
    const projects = await this.prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async findTotalValue(id: number) {
    const totalValue = await this.prismaClient.$queryRaw(Prisma.sql`
    select
      id,
      data_inicio_formatada,
      data_fim_formatada,
      meses,
      valor_total_previsto
    from
        dev.v_grafico_curva_s
    where
        data_fim > data_inicio
        and valor_total_previsto is not null
        and id = ${id};`);
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
  }

  async findOne(id: number) {
    const project = await this.prismaClient.projeto.findUnique({
      where: { id },
    });
    return project;
  }

  async update(id: number, updateProjetoDto: UpdateProjetoDto) {
    const projeto = await this.prismaClient.projeto.update({
      where: {
        id,
      },
      data: updateProjetoDto,
    });

    return projeto;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await this.prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }
}
