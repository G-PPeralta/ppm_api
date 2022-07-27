import { PartialType } from '@nestjs/swagger';
import { CreateStatusProjetoDto } from './create-status-projeto.dto';

export class UpdateStatusProjetoDto extends PartialType(CreateStatusProjetoDto) {}
