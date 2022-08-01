import { PartialType } from '@nestjs/swagger';
import { CreateTipoResponsavelDto } from './create-tipo-responsavel.dto';

export class UpdateTipoResponsavelDto extends PartialType(CreateTipoResponsavelDto) {}
