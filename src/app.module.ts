import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { ProjetosModule } from './projetos/projetos.module';
import { GanttModule } from './gantt/gantt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    RolesModule,
    ProjetosModule,
    GanttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
