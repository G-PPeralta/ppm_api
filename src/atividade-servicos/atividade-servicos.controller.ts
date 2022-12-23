import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AtividadeServicosService } from './atividade-servicos.service';
import { CreateAtividadeServicoDto } from './dto/create-atividade-servico.dto';

@UseGuards(JwtAuthGuard)
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
