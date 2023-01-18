/**
 *  CRIADO EM: 15/08/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a detalhamento
 */
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DetalhamentoService } from './detalhamento.service';

@UseGuards(JwtAuthGuard)
@Controller('detalhamento')
export class DetalhamentoController {
  constructor(private readonly detalhamentoService: DetalhamentoService) {}

  @Get('/progresso/:id')
  async findOneProgresso(@Param('id') id: number) {
    const percentual = this.detalhamentoService.findOneProgresso(+id);
    return percentual;
  }

  @Get('/info-financeiro/:id')
  async findOneInfoFinanc(@Param('id') id: number) {
    const info = await this.detalhamentoService.findOneInfoFinanc(+id);
    return info;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      const project = this.detalhamentoService.findOne(+id);
      return project;
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/orcamento/:id')
  async findOneOrcamento(@Param('id') id: number) {
    const orcamento = await this.detalhamentoService.findOneOrcamento(+id);
    return orcamento;
  }

  @Get('/realizado/:id')
  async findOneRealizado(@Param('id') id: number) {
    const realizado = await this.detalhamentoService.findOneRealizado(+id);
    return realizado;
  }

  @Get('/nao-previsto/:id')
  async findOneNaoPrevisto(@Param('id') id: number) {
    const naoPrevisto = await this.detalhamentoService.findOneNaoPrevisto(+id);
    return naoPrevisto;
  }

  @Get('/nao-previsto-percentual/:id')
  async findOneNaoPrevistoPercentual(@Param('id') id: number) {
    const naoPrevisto = await this.detalhamentoService.findOneNaoPrevisto(+id);
    return naoPrevisto;
  }

  @Get('/cpi-spi/:id')
  async findOneCpiSpi(@Param('id') id: number) {
    const cpiSpi = await this.detalhamentoService.findOneCpiSpi(+id);
    return cpiSpi;
  }
}
