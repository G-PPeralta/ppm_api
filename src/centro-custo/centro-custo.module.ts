import { Module } from '@nestjs/common';
import { CentroCustoService } from './centro-custo.service';
import { CentroCustoController } from './centro-custo.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CentroCustoService],
  controllers: [CentroCustoController],
})
export class CentroCustoModule {}
