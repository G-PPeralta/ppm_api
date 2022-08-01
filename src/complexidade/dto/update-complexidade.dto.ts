import { PartialType } from '@nestjs/swagger';
import { CreateComplexidadeDto } from './create-complexidade.dto';

export class UpdateComplexidadeDto extends PartialType(CreateComplexidadeDto) {}
