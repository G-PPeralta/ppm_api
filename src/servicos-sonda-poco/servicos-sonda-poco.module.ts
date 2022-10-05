import { Module } from '@nestjs/common';
import { ServicosSondaPocoService } from './servicos-sonda-poco.service';
import { ServicosSondaPocoController } from './servicos-sonda-poco.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServicosSondaPocoService],
  controllers: [ServicosSondaPocoController],
})
export class ServicosSondaPocoModule {}
