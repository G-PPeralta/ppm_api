import { PartialType } from '@nestjs/swagger';
import { CreateClassificacaoDto } from './create-classificacao.dto';

export class UpdateClassificacaoDto extends PartialType(
  CreateClassificacaoDto,
) {}
