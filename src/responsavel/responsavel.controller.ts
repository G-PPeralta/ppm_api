import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  // ConflictException,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}

  @Post()
  async create(@Body() createResponsavelDto: CreateResponsavelDto) {
    // const responsavel = createResponsavelDto.responsaveis.map(async (res) => {
    //   const responsavelAlreadyExists = await this.responsavelService.findByName(
    //     res.nome,
    //   );
    //   if (responsavelAlreadyExists) {
    //     throw new ConflictException(`Responsável ${res.nome} já cadastrado`);
    //   }
    //   return await this.responsavelService.create(res);
    // });

    const responsavelAlreadyExists = await this.responsavelService.findByName(
      createResponsavelDto.nome,
    );

    //if (responsavelAlreadyExists) {
    //  throw new ConflictException(
    //    `Responsável ${createResponsavelDto.nome} já cadastrado`,
    //  );
    //}

    const responsavel = await this.responsavelService.create(
      createResponsavelDto,
    );

    return responsavel;
  }

  @Get()
  async findAll() {
    try {
      return this.responsavelService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsavelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponsavelDto: UpdateResponsavelDto,
  ) {
    return this.responsavelService.update(+id, updateResponsavelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsavelService.remove(+id);
  }
}
