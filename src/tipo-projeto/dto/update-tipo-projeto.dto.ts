import { PartialType } from '@nestjs/swagger';
import { CreateTipoProjetoDto } from './create-tipo-projeto.dto';

export class UpdateTipoProjetoDto extends PartialType(CreateTipoProjetoDto) {}
