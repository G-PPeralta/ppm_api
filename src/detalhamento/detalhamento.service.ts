import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CpiSpi } from './dto/cpi-spi.dto';
import { InfoFinanceiro } from './dto/financeiro-dto';
// import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
// import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Injectable()
export class DetalhamentoService {
  constructor(private prisma: PrismaService) {}
  // create(createDetalhamentoDto: CreateDetalhamentoDto) {
  //   return 'This action adds a new detalhamento';
  // }

  // findAll() {
  //   return `This action returns all detalhamento`;
  // }

  async findOne(id: number) {
    const projeto = await this.prisma.$queryRaw(Prisma.sql`
    select
	    nome_projeto,
	    data_inicio,
	    data_fim,
	    numero,
	    polo,
	    local,
	    demanda,
      descricao,
      justificativa,
	    tr.nome_responsavel,
	    tc.coordenador_nome 
    from
	    tb_projetos tp
    left join tb_polos tp2 on
	    tp.polo_id = tp2.id
    left join tb_locais tl on
	    tp.local_id = tl.id
    left join tb_demandas td on
	    tp.demanda_id = td.id
    left join tb_responsaveis tr on
	    tp.responsavel_id = tr.responsavel_id
    left join tb_coordenadores tc on
	    tp.coordenador_id = tc.id_coordenador 
    where tp.id = ${id};
    `);

    return projeto;
  }

  async findOneProgresso() {
    const percentual = await this.prisma.$queryRawUnsafe(`
    SELECT coalesce(dev.fn_cron_calc_pct_real(0), 0) as fn_cron_calc_pct_real
  `);
    return percentual;
  }

  async findOneOrcamento(id: number) {
    const notFound = { valorTotalPrevisto: 0 };
    const orcamento = await this.prisma.projeto.findFirst({
      where: { id },
      select: { valorTotalPrevisto: true },
    });
    if (!orcamento) return notFound;
    return orcamento;
  }

  async findOneRealizado(id: number) {
    const notFound = { valor: 0 };
    const projeto = await this.prisma.tb_valores_projeto.findFirst({
      where: { id, tipo_valor_id: 2 },
      select: { valor: true },
    });

    if (!projeto) return notFound;

    return projeto;
  }

  async findOneNaoPrevisto(id: number) {
    let naoPrevisto = 0;
    const realizado = await this.findOneRealizado(id);
    const previsto = await this.prisma.tb_valores_projeto.findFirst({
      where: { id, tipo_valor_id: 1 },
      select: { valor: true },
    });

    if (realizado !== null && previsto !== null) {
      if (Number(realizado.valor) - Number(previsto.valor) > 0) {
        naoPrevisto = Number(realizado.valor) - Number(previsto.valor);
      }
    }
    return naoPrevisto;
  }

  async findOneNaoPrevistoPercentual(id: number) {
    let naoPrevistoPercentual = 0;
    const naoPrevisto = await this.findOneNaoPrevisto(id);
    const orcamento = await this.findOneOrcamento(id);

    if (naoPrevisto !== null) {
      if (naoPrevisto > 0) {
        naoPrevistoPercentual =
          (naoPrevisto / Number(orcamento.valorTotalPrevisto)) * 100;
      }
    }
    return naoPrevistoPercentual;
  }

  // INFORMAÇÕES DO CARD FINANCEIRO

  async findOneInfoFinanc(id: number) {
    const query: InfoFinanceiro[] = await this.prisma.$queryRaw`  
    select
      vlr_remanescente / vlr_planejado * 100 as pct_remanescente,
      vlr_realizado / vlr_planejado * 100 as pct_realizado,
      vlr_nao_prev / vlr_planejado * 100 as pct_nao_previsto,
      vlr_planejado,
      vlr_realizado,
      vlr_nao_prev,
      vlr_remanescente
    from
    (
    select
        case
            when sum(vlr_nao_prev) <= 0 then 0.00001
            else sum(vlr_nao_prev)
        end as vlr_nao_prev,
        case
            when sum(vlr_nao_prev) = 0 then 0.00000001
            else sum(vlr_nao_prev)*-1
        end as vlr_remanescente,        
        case
            when sum(vlr_planejado) =0 then 0.00000001
            else sum(vlr_planejado)
        end as vlr_planejado,
        case
            when sum(vlr_realizado) = 0 then 0.00000001
            else sum(vlr_realizado)
        end as vlr_realizado,
        sum(vlr_planejado)
    from
        (
        select
            case
                when sum(c.valor_total_previsto) is null 
                then 0
                else sum(valor_total_previsto)-1
            end as vlr_nao_prev,
            sum(valor_total_previsto) as vlr_planejado,
            0 as vlr_realizado
        from
            tb_projetos c
            where c.id = ${id}
    union
        select
            case
                when sum(vlr_realizado) is null 
                then 0
                else sum(vlr_realizado)
            end as vlr_nao_prev,
            0 as vlr_planejado,
            sum(vlr_realizado) as vlr_realizado
        from
            dev.tb_projetos_atividade_custo_real a
        inner join dev.tb_projetos_atividade b
            on
            a.id_atividade = b.id
        inner join dev.tb_projetos c
            on
            b.id_projeto = c.id
            where c.id = ${id}
            --where c.tipo_projeto_id in (1,2)
    ) as qr
    ) as qr2;`;
    return query.map((info) => ({
      planejado: Number(info.vlr_planejado),
      realizado: Number(info.vlr_realizado),
      naoPrevisto: Number(info.vlr_nao_prev),
      remanescente: Number(info.vlr_remanescente),
      pctRealizado: Number(info.pct_realizado),
      pctRemanescente: Number(info.pct_remanescente),
      pctNaoPrevisto: Number(info.pct_nao_previsto),
    }));
  }

  async findOneCpiSpi(id) {
    const query: CpiSpi[] = await this.prisma.$queryRaw`
      select
    id_projeto as id_projeto,
    coalesce(vlr_va / vlr_cr, 1) as vlr_cpi,
    coalesce(vlr_va / vlr_vp, 1) as vlr_spi
from
    (
    select
        id_projeto,
        (dev.fn_cron_calc_pct_plan_projeto(0,
        id_projeto)/ 100) * sum(vlr_planejado) as vlr_vp,
        (dev.fn_cron_calc_pct_real_projeto(0,
        id_projeto)/ 100) * sum(vlr_planejado) as vlr_va,
        sum(vlr_realizado) as vlr_cr
    from
        (
        select
            id_projeto,
            case
                when sum(vlr_planejado) is null 
                then 0
                else sum(vlr_planejado)
            end as vlr_planejado,
            0 as vlr_realizado
        from
            dev.tb_projetos_atividade_custo_plan a
        inner join dev.tb_projetos_atividade b
            on
            a.id_atividade = b.id
        inner join dev.tb_projetos c
            on
            b.id_projeto = c.id
            --where c.tipo_projeto_id in (1,2)
        group by id_projeto
    union
        select
            id_projeto,
            0 as vlr_planejado,
            case
                when sum(vlr_realizado) is null 
                then 0
                else sum(vlr_realizado)
            end as vlr_realizado
        from
            dev.tb_projetos_atividade_custo_real a
        inner join dev.tb_projetos_atividade b
            on
            a.id_atividade = b.id
        inner join dev.tb_projetos c
            on
            b.id_projeto = c.id
            --where c.tipo_projeto_id in (1,2)
        group by id_projeto
    ) as qr
    group by id_projeto
) as qr2
where id_projeto = ${id};`;

    if (query.length <= 0) {
      return { cpi: 1, spi: 1 };
    }

    return query.map((calc) => ({
      cpi: Number(calc.vlr_cpi),
      spi: Number(calc.vlr_spi),
    }));
  }

  // async findOneRemanescente(id: number) {
  //   let remanescente = { valor: 0 };
  //   const orcamento = await this.findOneOrcamento(id);
  //   const realizado = await this.findOneRealizado(id);

  //   if (orcamento !== null && realizado !== null) {
  //     remanescente.valor =
  //       Number(orcamento.valorTotalPrevisto) - Number(realizado.valor);
  //   }

  //   if (remanescente.valor === Number(orcamento.valorTotalPrevisto)) {
  //     remanescente = { valor: 0 };
  //   }

  //   return remanescente;
  // }

  // update(id: number, updateDetalhamentoDto: UpdateDetalhamentoDto) {
  //   return `This action updates a #${id} detalhamento`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} detalhamento`;
  // }
}
