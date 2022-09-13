import { PartialType } from '@nestjs/swagger';
import { CreateProjetoIntervencaoDto } from './create-projeto-intervencao.dto';

export class UpdateProjetoIntervencaoDto extends PartialType(
  CreateProjetoIntervencaoDto,
) {}
