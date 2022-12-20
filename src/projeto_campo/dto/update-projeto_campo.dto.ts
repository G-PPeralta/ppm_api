import { PartialType } from '@nestjs/swagger';
import { CreateProjetoCampoDto } from './create-projeto_campo.dto';

export class UpdateProjetoCampoDto extends PartialType(CreateProjetoCampoDto) {}
