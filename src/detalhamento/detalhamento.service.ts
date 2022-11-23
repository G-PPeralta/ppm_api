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
		tp.id,
	    nome_projeto,
	    coalesce((
	    	select min(atividades.dat_ini_plan) from
	    	tb_projetos_atividade atividades
	    	where atividades.id_pai = topo.id
	    	and atividades.dat_usu_erase is null
	    ), data_inicio) as data_inicio,
	    coalesce((
	    	select max(atividades.dat_fim_plan) from
	    	tb_projetos_atividade atividades
	    	where atividades.id_pai = topo.id
	    	and atividades.dat_usu_erase is null
	    ), data_fim) as data_fim,
	    numero,
	    polo,
	    local,
	    demanda,
      descricao,
      justificativa,
	    tr.nome_responsavel,
	    tc.coordenador_nome,
	    tsp.solicitante,
	    case when tp."dataFim_real" > data_fim then date_part('day', age(tp."dataFim_real",data_fim)) else 0 end as atraso,
      tp.dat_usu_update
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
	  left join tb_solicitantes_projetos tsp on
		  tsp.id = tp.solicitante_id
	  left join tb_projetos_atividade topo on
		  topo.id_projeto = tp.id
    where tp.id = ${id}
      and topo.id_pai = 0
    ;
    `);

    return projeto;
  }

  async findOneProgresso(id: number) {
    const percentual = await this.prisma.$queryRawUnsafe(`
    SELECT round(fn_se_calcula_pct_projeto(${id})*100, 0) as fn_cron_calc_pct_real
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
        case when vlr_remanescente / vlr_planejado * 100 < 0 then 0 else round(vlr_remanescente / vlr_planejado * 100, 1) end as pct_remanescente,
        case when vlr_realizado / vlr_planejado > 1 then 100 else round((vlr_realizado / vlr_planejado * 100), 1) end as pct_realizado,
        case when vlr_realizado < 0.1 then 0 when vlr_planejado < 0.1 then 0 else round((vlr_realizado / (vlr_realizado - vlr_planejado)-1) * 100, 1) end as pct_nao_previsto,
        vlr_planejado,
        vlr_realizado,
        round(vlr_realizado - vlr_planejado, 2) as vlr_nao_prev,
        case when  vlr_remanescente < 0 then 0 else vlr_remanescente end as vlr_remanescente
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
                  else sum(valor_total_previsto)
              end as vlr_nao_prev,
              sum(valor_total_previsto) as vlr_planejado,
              0 as vlr_realizado
          from
              tb_projetos c
              where c.id = ${id}
      union
              select
                  case
                      when sum(valor) is null 
                      then 0
                      else sum(valor)
                  end as vlr_nao_prev,
                  0 as vlr_planejado,
                  sum(valor) as vlr_realizado
              from
                  tb_centro_custo a
              inner join tb_projetos c
                  on
                  a.projeto_id = c.id
              where c.id = ${id}
              --where c.tipo_projeto_id in (1,2)
      ) as qr
      ) as qr2`;
    return query.map((info) => ({
      planejado: Number(info.vlr_planejado),
      realizado: Number(info.vlr_realizado),
      naoPrevisto: Number(info.vlr_nao_prev),
      remanescente: Number(Number(info.vlr_remanescente).toFixed(0)),
      pctRealizado: Number(info.pct_realizado),
      pctRemanescente: Number(info.pct_remanescente),
      pctNaoPrevisto: Number(info.pct_nao_previsto),
    }));
  }

  async findOneCpiSpi(id) {
    await this.prisma.$executeRawUnsafe(
      `select fn_se_calcula_spi_cpi('${id}');`,
    );

    const query: CpiSpi[] = await this.prisma.$queryRaw`
      select 
      id_projeto,
      case when vlr_spi is null then 1 else vlr_spi end as vlr_spi,
      case when vlr_cpi is null then 1 else vlr_cpi end as vlr_cpi
      from tb_projetos_spi_cpi tpsc where id_projeto = ${id}
      `;

    if (query.length <= 0) {
      const ret: any = [];
      ret.push({ cpi: 1, spi: 1 });
      return ret;
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
