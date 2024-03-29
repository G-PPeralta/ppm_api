import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { ProjetosModule } from './projetos/projetos.module';
import { GanttModule } from './gantt/gantt.module';
import { PoloModule } from './polo/polo.module';
import { LocalModule } from './local/local.module';
import { SolicitanteModule } from './solicitante/solicitante.module';
import { ClassificacaoModule } from './classificacao/classificacao.module';
import { DivisaoModule } from './divisao/divisao.module';
import { GateModule } from './gate/gate.module';
import { TipoProjetoModule } from './tipo-projeto/tipo-projeto.module';
import { DemandaModule } from './demanda/demanda.module';
import { StatusProjetoModule } from './status-projeto/status-projeto.module';
import { PrioridadeModule } from './prioridade/prioridade.module';
import { ComplexidadeModule } from './complexidade/complexidade.module';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DetalhamentoModule } from './detalhamento/detalhamento.module';
import { CoordenadorModule } from './coordenador/coordenador.module';
import { CampanhaModule } from './campanha/campanha.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { SondaModule } from './sonda/sonda.module';
import { AtividadesIntervencoesModule } from 'atividades-intervencoes/atividades-intervencoes.module';
import { AreaAtuacaoModule } from './area-atuacao/area-atuacao.module';
import { PocoModule } from './poco/poco.module';
import { CamposModule } from './campos/campos.module';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ProjetosAtividadesModule } from './projetos-atividades/projetos-atividades.module';
import { ProjetosAtividadesNotasModule } from './projetos-atividades-notas/projetos-atividades-notas.module';
import { ProjetosAtividadesLicoesAprendidasModule } from './projetos-atividades-licoes-aprendidas/projetos-atividades-licoes-aprendidas.module';
import { RankingsModule } from './rankings/rankings.module';
import { RankingsOpcoesModule } from './rankings-opcoes/rankings-opcoes.module';
import { ProjetosRankingModule } from './projetos-ranking/projetos-ranking.module';
import { AreasModule } from './areas/areas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { BudgetsModule } from './budgets/budgets.module';
import { EstatisticasModule } from './estatisticas/estatisticas.module';
import { CampanhaProjetoTipoModule } from './campanha-projeto-tipo/campanha-projeto-tipo.module';
import { NovaAtividadeModule } from './nova-atividade/nova-atividade.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { AtividadeFerramentasModule } from './atividade-ferramentas/atividade-ferramentas.module';
import { AtividadeServicosModule } from './atividade-servicos/atividade-servicos.module';
import { AtividadesProjetosModule } from './atividades-projetos/atividades-projetos.module';
import { LookaheadModule } from './lookahead/lookahead.module';
import { NovaOperacaoModule } from 'nova-operacao/nova-operacao.module';
import { ServicosSondaPocoModule } from './servicos-sonda-poco/servicos-sonda-poco.module';
import { ProjetosFinanceiroModule } from './projetos-financeiro/projetos-financeiro.module';
import { CentroCustoModule } from './centro-custo/centro-custo.module';
import { ClasseServicoModule } from './classe-servico/classe-servico.module';
import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { FiltrosModule } from './filtros/filtros.module';
import { EditarAtividadeModule } from './editar-atividade/editar-atividade.module';
import { GraficosModule } from './graficos/graficos.module';
import { PdfModule } from './pdf/pdf.module';
import { LixeiraModule } from './lixeira/lixeira.module';
import { AreaResponsavelModule } from './area_responsavel/area_responsavel.module';
import { FeriadosModule } from './feriados/feriados.module';
import { S3Module } from './s3/s3.module';
import { PriorizacoesController } from './priorizacoes/priorizacoes.controller';
import { PriorizacoesModule } from './priorizacoes/priorizacoes.module';
import { DescribeModule } from './describe/describe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    RolesModule,
    ProjetosModule,
    GanttModule,
    PoloModule,
    LocalModule,
    SolicitanteModule,
    ClassificacaoModule,
    DivisaoModule,
    GateModule,
    TipoProjetoModule,
    DemandaModule,
    StatusProjetoModule,
    PrioridadeModule,
    ComplexidadeModule,
    ResponsavelModule,
    DashboardModule,
    DetalhamentoModule,
    CoordenadorModule,
    CampanhaModule,
    PrismaModule,
    SondaModule,
    AtividadesIntervencoesModule,
    AreaAtuacaoModule,
    PocoModule,
    CamposModule,
    FornecedoresModule,
    ProjetosAtividadesModule,
    ProjetosAtividadesNotasModule,
    ProjetosAtividadesLicoesAprendidasModule,
    RankingsModule,
    RankingsOpcoesModule,
    ProjetosRankingModule,
    AreasModule,
    CategoriasModule,
    BudgetsModule,
    EstatisticasModule,
    CampanhaProjetoTipoModule,
    NovaAtividadeModule,
    TarefasModule,
    AtividadeFerramentasModule,
    AtividadeServicosModule,
    AtividadesProjetosModule,
    NovaOperacaoModule,
    LookaheadModule,
    ServicosSondaPocoModule,
    ProjetosFinanceiroModule,
    CentroCustoModule,
    ClasseServicoModule,
    OcorrenciasModule,
    FiltrosModule,
    EditarAtividadeModule,
    GraficosModule,
    PdfModule,
    LixeiraModule,
    AreaResponsavelModule,
    FeriadosModule,
    S3Module,
    PriorizacoesModule,
    DescribeModule,
  ],
  controllers: [AppController, PriorizacoesController],
  providers: [AppService],
})
export class AppModule {}
