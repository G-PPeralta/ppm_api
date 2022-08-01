import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { ProjetosModule } from './projetos/projetos.module';
import { GanttModule } from './gantt/gantt.module';
import { LogModule } from './log/log.module';
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
import { TipoResponsavelModule } from './tipo-responsavel/tipo-responsavel.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    RolesModule,
    ProjetosModule,
    GanttModule,
    LogModule,
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
    TipoResponsavelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
