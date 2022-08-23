import {
  Controller,
  Get,
  NotFoundException,
  // Post,
  // Body,
  // Patch,
  Param,
  // Delete,
} from '@nestjs/common';
import { DetalhamentoService } from './detalhamento.service';
// import { CreateDetalhamentoDto } from './dto/create-detalhamento.dto';
// import { UpdateDetalhamentoDto } from './dto/update-detalhamento.dto';

@Controller('detalhamento')
export class DetalhamentoController {
  constructor(private readonly detalhamentoService: DetalhamentoService) {}

  // @Post()
  // create(@Body() createDetalhamentoDto: CreateDetalhamentoDto) {
  //   return this.detalhamentoService.create(createDetalhamentoDto);
  // }

  // @Get()
  // findAll() {
  //   return this.detalhamentoService.findAll();
  // }

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

  // @Get('/remanescente/:id')
  // async findOneRemanescente(@Param('id') id: number) {
  //   const remanescente = await this.detalhamentoService.findOneRemanescente(
  //     +id,
  //   );
  //   return remanescente;
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDetalhamentoDto: UpdateDetalhamentoDto,
  // ) {
  //   return this.detalhamentoService.update(+id, updateDetalhamentoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.detalhamentoService.remove(+id);
  // }
}