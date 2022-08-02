import { PartialType } from '@nestjs/swagger';
import { CreatePrioridadeDto } from './create-prioridade.dto';

export class UpdatePrioridadeDto extends PartialType(CreatePrioridadeDto) {}
