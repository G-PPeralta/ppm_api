import { Controller, Get, Post, Body } from '@nestjs/common';
import { AtividadeFerramentasService } from './atividade-ferramentas.service';
import { CreateAtividadeFerramentaDto } from './dto/create-atividade-ferramenta.dto';

@Controller('atividade-ferramentas')
export class AtividadeFerramentasController {
  constructor(
    private readonly atividadeFerramentasService: AtividadeFerramentasService,
  ) {}

  @Post()
  async create(
    @Body() createAtividadeFerramentaDto: CreateAtividadeFerramentaDto,
  ) {
    return await this.atividadeFerramentasService.create(
      createAtividadeFerramentaDto,
    );
  }

  @Get()
  async findAll() {
    return await this.atividadeFerramentasService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.atividadeFerramentasService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAtividadeFerramentaDto: UpdateAtividadeFerramentaDto) {
  //   return this.atividadeFerramentasService.update(+id, updateAtividadeFerramentaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.atividadeFerramentasService.remove(+id);
  // }
}
