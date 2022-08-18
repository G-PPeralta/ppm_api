import { PartialType } from '@nestjs/swagger';
import { CreatePepDto } from './create-pep.dto';

export class UpdatePepDto extends PartialType(CreatePepDto) {}
