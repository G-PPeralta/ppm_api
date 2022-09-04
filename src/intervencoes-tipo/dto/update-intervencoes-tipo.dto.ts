import { PartialType } from '@nestjs/swagger';
import { CreateIntervencoesTipoDto } from './create-intervencoes-tipo.dto';

export class UpdateIntervencoesTipoDto extends PartialType(
  CreateIntervencoesTipoDto,
) {}
