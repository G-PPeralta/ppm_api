import { PartialType } from '@nestjs/swagger';
import { CreateIntervencaoDto } from './create-intervencao.dto';

export class UpdateIntervencoeDto extends PartialType(CreateIntervencaoDto) {}
