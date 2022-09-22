import { PartialType } from '@nestjs/swagger';
import { CreateSondaDto } from './create-sonda.dto';

export class UpdateSondaDto extends PartialType(CreateSondaDto) {}
