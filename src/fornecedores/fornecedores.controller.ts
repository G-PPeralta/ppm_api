import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedoreDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedore.dto';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post()
  create(@Body() createFornecedoreDto: CreateFornecedoreDto) {
    return this.fornecedoresService.create(createFornecedoreDto);
  }

  @Get()
  findAll() {
    return this.fornecedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedoresService.findOne(+id);
  }

  @Patch()
  update(@Body() updateFornecedoreDto: UpdateFornecedorDto) {
    return this.fornecedoresService.update(updateFornecedoreDto);
  }

  @Patch(':id')
  remove(@Param('/delete/id') id: string) {
    return this.fornecedoresService.remove(+id);
  }
}
