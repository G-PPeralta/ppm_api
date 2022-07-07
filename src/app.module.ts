import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TarefaModule } from './tarefa/tarefa.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { ProjetosModule } from './projetos/projetos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TarefaModule,
    UserModule,
    AuthModule,
    RolesModule,
    ProjetosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
