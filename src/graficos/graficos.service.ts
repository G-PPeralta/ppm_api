import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
@Injectable()
export class GraficosService {
  constructor(private prisma: PrismaService) {}
  async getHistorico(dataIni?, dataFim?) {
    let where = '';
    if (dataIni && dataFim) {
      where = `and atividades.dat_ini_real >= '${new Date(
        dataIni,
      ).toISOString()}'
      and atividades.dat_fim_real <= '${new Date(dataFim).toISOString()}' `;
    }
    const retorno: any[] = await this.prisma.$queryRawUnsafe(`
    select t.id_sonda, t.sonda, t.poco, t.id_poco, 
      round(min(hrs_reais)) as vlr_min,
      round(max(hrs_reais)) as vlr_max,
      round(avg(hrs_reais)) as vlr_med 
    from (
      select
        sonda.id as id_sonda,
        sonda.nom_atividade as sonda,
        pocos.nom_atividade as poco,
        pocos.id as id_poco,
        case when atividades.nom_atividade is null then tarefas.nom_operacao 
        else atividades.nom_atividade end as nome_atividade,
        atividades.id as id_atividade, --verificar se é id da atividade ou da origem
        case when fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) is null then 0 
        else fn_hrs_totais_cronograma_atvv(atividades.dat_ini_real, atividades.dat_fim_real) end as hrs_reais
        from
        tb_projetos_atividade sonda
        inner join tb_projetos_atividade pocos
        on pocos.id_pai = sonda.id
        inner join tb_projetos_atividade atividades
        on (atividades.id_pai = pocos.id)
        left join tb_projetos_operacao tarefas
        on (tarefas.id = atividades.id_operacao)
        where
        sonda.id_pai = 0 ${where}
        group by 
        sonda.id, sonda.nom_atividade, pocos.nom_atividade, pocos.id,
        case when atividades.nom_atividade is null then tarefas.nom_operacao else atividades.nom_atividade end,
        atividades.id
        order by atividades.id_pai asc, atividades.dat_ini_real asc
    ) as t
    group by t.id_poco, t.poco, t.id_sonda, t.sonda
    `);
    return retorno;
  }
  getHistoricoMock() {
    return [
      {
        month: 'Pir-61',
        duration: 90,
      },
      {
        month: 'Pir-62',
        duration: 80,
      },
      {
        month: 'Pir-63',
        duration: 70,
      },
      {
        month: 'Pir-64',
        duration: 60,
      },
      {
        month: 'Pir-65',
        duration: 50,
      },
      {
        month: 'Pir-66',
        duration: 40,
      },
      {
        month: 'Pir-67',
        duration: 30,
      },
      {
        month: 'Pir-68',
        duration: 20,
      },
      {
        month: 'Pir-69',
        duration: 90,
      },
      {
        month: 'Pir-70',
        duration: 70,
      },
      {
        month: 'Pir-71',
        duration: 50,
      },
      {
        month: 'Pir-72',
        duration: 100,
      },
    ];
  }
  getIntervencao() {
    return [
      {
        month: 'Pir-61',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-62',
        Manutenção: 5,
        'Recurso Origem': 5,
        'Recurso Cia': 10,
        'Condições Climáticas': 50,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-63',
        Manutenção: 5,
        'Recurso Origem': 5,
        'Recurso Cia': 10,
        'Condições Climáticas': 50,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-64',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-65',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-66',
        Manutenção: 5,
        'Recurso Origem': 5,
        'Recurso Cia': 10,
        'Condições Climáticas': 50,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-67',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-68',
        Manutenção: 20,
        'Recurso Origem': 20,
        'Recurso Cia': 20,
        'Condições Climáticas': 20,
        'Informações Técnicas': 20,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-69',
        Manutenção: 5,
        'Recurso Origem': 5,
        'Recurso Cia': 10,
        'Condições Climáticas': 50,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-70',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
      {
        month: 'Pir-71',
        Manutenção: 10,
        'Recurso Origem': 10,
        'Recurso Cia': 10,
        'Condições Climáticas': 10,
        'Informações Técnicas': 10,
        'Aguardando Outros': 90,
      },
      {
        month: 'Pir-72',
        Manutenção: 10,
        'Recurso Origem': 20,
        'Recurso Cia': 10,
        'Condições Climáticas': 30,
        'Informações Técnicas': 10,
        'Aguardando Outros': 20,
      },
    ];
  }
}
