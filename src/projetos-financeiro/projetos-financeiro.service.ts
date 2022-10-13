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
    coalesce(to_char(centro_custo.data, 'MM'), '') as mes
    from tb_projetos projetos
    left join
    tb_centro_custo centro_custo
    on centro_custo.projeto_id = projetos.id
    where
    projetos.tipo_projeto_id in (1, 2)
    group by 
    projetos.id, projetos.nome_projeto, projetos.elemento_pep, projetos.valor_total_previsto, centro_custo.data
    `);
  }

  async findFilhos(id: number) {
    let retorno: any[] = [];
    retorno = await this.prisma.$queryRawUnsafe(`select 
    projetos.id as idProjeto,
    projetos.nome_projeto as nomeProjeto,
    coalesce(projetos.elemento_pep, '') as elementoPep,
    coalesce(centro_custo.id, 0) as idCusto,
    '' as prestadorDeServico,
    '' as classeDoServico,
    coalesce(centro_custo.data, '') as dataPagamento,
    projetos.valor_total_previsto as previsto,
    coalesce(centro_custo.valor, 0) as realizado,
    coalesce(centro_custo.descricao_do_servico, '') as descricaoDoServico
    from tb_projetos projetos
    left join tb_projetos_atividade atividade_pai
    on atividade_pai.id_projeto = projetos.id and atividade_pai.id_pai = 0
    left join tb_projetos_atividade grupo_atividade
    on grupo_atividade.id_pai = atividade_pai.id
    left join tb_projetos_atividade atividades
    on atividades.id_pai = grupo_atividade.id
    left join tb_centro_custo centro_custo
    on centro_custo.projeto_id = projetos.id
    where
    projetos.tipo_projeto_id in (1, 2)
    and projetos.id = ${id}`);

    const tratamento: any[] = [];
    for (const e of retorno) {
      const dados = {
        idProjeto: e.idprojeto,
        nomeProjeto: e.nomeprojeto,
        elementoPep: e.elementopep,
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
            previsto: e.previsto,
            realizado: e.realizado,
            descricaoDoServico: e.descricaodoservico,
          });
        }
      });
      if (!existe) {
        dados.centroDeCusto.push({
          idCusto: e.idcusto,
          prestadorDeServico: e.prestadordeservico,
          classeDoServico: e.classedoservico,
          dataPagamento: e.datapagamento,
          previsto: e.previsto,
          realizado: e.realizado,
          descricaoDoServico: e.descricaodoservico,
        });

        tratamento.push(dados);
      }
    }
    return tratamento;
  }
}
