import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaClient } from 'index.prisma';
// import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
// import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Injectable()
export class DetalhamentoService {
  // create(createDetalhamentoDto: CreateDetalhamentoDto) {
  //   return 'This action adds a new detalhamento';
  // }

  // findAll() {
  //   return `This action returns all detalhamento`;
  // }

  async findOne(id: number) {
    const projeto = await prismaClient.$queryRaw(Prisma.sql`
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
	    dev.tb_projetos tp
    left join dev.tb_polos tp2 on
	    tp.polo_id = tp2.id
    left join dev.tb_locais tl on
	    tp.local_id = tl.id
    left join dev.tb_demandas td on
	    tp.demanda_id = td.id
    left join dev.tb_responsaveis tr on
	    tp.responsavel_id = tr.responsavel_id
    left join dev.tb_coordenadores tc on
	    tp.coordenador_id = tc.id_coordenador 
    where tp.id = ${id};
    `);

    return projeto;
  }

  async findOneOrcamento(id: number) {
    const projeto = await prismaClient.projeto.findFirst({
      where: { id },
      select: { valorTotalPrevisto: true },
    });
    return projeto;
  }

  async findOneRealizado(id: number) {
    const notFound = { valor: '' };
    const projeto = await prismaClient.tb_valores_projeto.findFirst({
      where: { id, tipo_valor_id: 2 },
      select: { valor: true },
    });

    // const projeto = prismaClient.$queryRaw(
    //   Prisma.sql`select valor from dev.tb_valores_projeto where id=${id} and tipo_valor_id=2`,
    // );
    if (!projeto) return notFound;

    return projeto;
  }

  async findOneNaoPrevisto(id: number) {
    let naoPrevisto = 0;
    const realizado = await this.findOneRealizado(id);
    const previsto = await prismaClient.tb_valores_projeto.findFirst({
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

  async findOneRemanescente(id: number) {
    let remanescente = 0;
    const orcamento = await this.findOneOrcamento(id);
    const realizado = await this.findOneRealizado(id);

    if (orcamento !== null && realizado !== null) {
      remanescente = Number(orcamento.valorTotalPrevisto) - Number(realizado);
    }

    return remanescente;
  }

  // update(id: number, updateDetalhamentoDto: UpdateDetalhamentoDto) {
  //   return `This action updates a #${id} detalhamento`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} detalhamento`;
  // }
}
