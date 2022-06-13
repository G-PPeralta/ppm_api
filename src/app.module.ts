import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TarefaModule } from './tarefa/tarefa.module';

@Module({
  imports: [ConfigModule.forRoot(), TarefaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
