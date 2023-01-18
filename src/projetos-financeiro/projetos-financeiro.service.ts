/**
 * CRIADO EM: 13/10/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: serviço que lista projetos com suas respectivas informações financeiras (orçamento, total gasto, gap)
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class ProjetosFinanceiroService {
  constructor(private prisma: PrismaService) {}

  async findPais() {
    return this.prisma.$queryRawUnsafe(`
    select
	projetos.id as idProjeto,
	projetos.nome_projeto as nomeProjeto,
	coalesce(projetos.elemento_pep, '') as elementoPep,
	'' as denominacaoDeObjeto,
	'' as textoDoPedido,
	coalesce(projetos.valor_total_previsto, 0) as totalPrevisto,
	coalesce(sum(centro_custo.valor), 0) as totalRealizado,
	case
		when coalesce(sum(centro_custo.valor), 0) <= 0 then 0
		when coalesce(projetos.valor_total_previsto, 0) <= 0 then 0
		else ROUND(((1 - coalesce(sum(centro_custo.valor), 0) / coalesce(projetos.valor_total_previsto, 0)) * 100), 2)
	end as gap
from
	tb_projetos projetos
left join
    tb_centro_custo centro_custo
    on
	centro_custo.projeto_id = projetos.id
where
	projetos.tipo_projeto_id in (1, 2)
	and projetos.dat_usu_erase is null
  and centro_custo.dat_usu_erase is null
group by
	projetos.id,
	projetos.nome_projeto,
	projetos.elemento_pep,
	projetos.valor_total_previsto;
    `);
  }

  async apagarFinanceirosPorPai(id: number) {
    await this.prisma.$queryRawUnsafe(`
    update tb_centro_custo 
    set dat_usu_erase = now()
    where projeto_id = ${id}
    `);
  }

  async findFilhos(id: number) {
    // Lista as informações específicas dos gastos de um projeto. Retorna dados dos prestadores de serviço que consumiram o orçamento do projeto.
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`
    select 
    projetos.id as idProjeto,
    projetos.nome_projeto as nomeProjeto,
    coalesce(projetos.elemento_pep, '') as elementoPep,
    coalesce(centro_custo.id, 0) as idCusto,
    coalesce(fornecedores.nomefornecedor, '') as prestadorDeServico,
    coalesce(classe_servico.classe_servico, '') as classeDoServico,
    centro_custo.data as dataPagamento,
    coalesce(centro_custo.valor, 0) as valor,
    coalesce(centro_custo.descricao_do_servico, '') as descricaoDoServico,
    centro_custo.pedido as pedido,
    classe_servico.id AS classeDeServicoId,
    coalesce(centro_custo.bm, '') as bm,
    coalesce(centro_custo.id_nf, '') as id_nf,
    coalesce(centro_custo.valor_bm_nf, 0) as valor_bm_nf,
    centro_custo.status,
    centro_custo.data_pagamento,
    coalesce(centro_custo.valor_pago, 0) as valor_pago,
    fornecedores.id AS prestadorDeServicoId,
    (select min(dat_ini_plan) from tb_projetos_atividade where id_projeto = projetos.id) as dat_inicial
    from tb_projetos projetos
    left join tb_projetos_atividade atividade_pai
    on atividade_pai.id_projeto = projetos.id and atividade_pai.id_pai = 0
    left join tb_projetos_atividade grupo_atividade
    on grupo_atividade.id_pai = atividade_pai.id
    left join tb_projetos_atividade atividades
    on atividades.id_pai = grupo_atividade.id
    left join tb_centro_custo centro_custo
    on centro_custo.projeto_id = projetos.id and centro_custo.dat_usu_erase is null
    left join tb_classe_servico classe_servico
    on classe_servico.id = centro_custo.classe_servico_id
    left join tb_fornecedores fornecedores
    on fornecedores.id = centro_custo.prestador_servico_id
    where
    projetos.tipo_projeto_id in (1, 2)
    and projetos.id = ${id}
    group by 
    projetos.id,  centro_custo.id, classe_servico.classe_servico,centro_custo.data, centro_custo.valor, centro_custo.descricao_do_servico, 
    fornecedores.nomefornecedor, centro_custo.pedido, classe_servico.id, fornecedores.id, centro_custo.bm, centro_custo.id_nf, centro_custo.valor_bm_nf, centro_custo.status, centro_custo.data_pagamento, centro_custo.valor_pago 
    
    `);

    const tratamento: any[] = [];
    for (const e of retorno) {
      const dados = {
        idProjeto: e.idprojeto,
        nomeProjeto: e.nomeprojeto,
        elementoPep: e.elementopep,
        data_inicio: e.dat_inicial,
        centroDeCusto: [],
      };

      let existe = false;
      tratamento.forEach((inner) => {
        if ((inner.idProjeto = e.idprojeto)) {
          existe = true;
          inner.centroDeCusto.push({
            idCusto: e.idcusto,
            prestadorDeServico: e.prestadordeservico,
            classeDoServico: e.classedoservico,
            dataPagamento: e.datapagamento,
            valor: e.valor,
            descricaoDoServico: e.descricaodoservico,
            pedido: e.pedido,
            classeDeServicoId: e.classedeservicoid,
            prestadorDeServicoId: e.prestadordeservicoid,
            bm: e.bm,
            id_nf: e.id_nf,
            valor_bm_nf: e.valor_bm_nf,
            status: e.status,
            data_pagamento: e.data_pagamento ? e.data_pagamento : null,
            valor_pago: e.valor_pago,
          });
        }
      });

      if (!existe) {
        dados.centroDeCusto.push({
          idCusto: e.idcusto,
          prestadorDeServico: e.prestadordeservico,
          classeDoServico: e.classedoservico,
          dataPagamento: e.datapagamento,
          valor: e.valor,
          descricaoDoServico: e.descricaodoservico,
          pedido: e.pedido,
          classeDeServicoId: e.classedeservicoid,
          prestadorDeServicoId: e.prestadordeservicoid,
          bm: e.bm,
          id_nf: e.id_nf,
          valor_bm_nf: e.valor_bm_nf,
          status: e.status,
          data_pagamento: e.data_pagamento ? e.data_pagamento : null,
          valor_pago: e.valor_pago,
        });

        tratamento.push(dados);
      }
    }
    return tratamento[0];
  }
}
