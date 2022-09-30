import { Controller, Get, Post, Body } from '@nestjs/common';
import { AtividadeServicosService } from './atividade-servicos.service';
import { CreateAtividadeServicoDto } from './dto/create-atividade-servico.dto';

@Controller('atividade-servicos')
export class AtividadeServicosController {
  constructor(
    private readonly atividadeServicosService: AtividadeServicosService,
  ) {}

  @Post()
  async create(@Body() createAtividadeServicoDto: CreateAtividadeServicoDto) {
    return await this.atividadeServicosService.create(
      createAtividadeServicoDto,
    );
  }

  @Get()
  async findAll() {
    return await this.atividadeServicosService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.atividadeServicosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAtividadeServicoDto: UpdateAtividadeServicoDto) {
  //   return this.atividadeServicosService.update(+id, updateAtividadeServicoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.atividadeServicosService.remove(+id);
  // }
}
