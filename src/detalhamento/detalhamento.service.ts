import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
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
    SELECT dev.fn_cron_calc_pct_real(0)
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
