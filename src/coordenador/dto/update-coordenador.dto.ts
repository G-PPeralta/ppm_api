import { PartialType } from '@nestjs/swagger';
import { CreateCoordenadorDto } from './create-coordenador.dto';

export class UpdateCoordenadorDto extends PartialType(CreateCoordenadorDto) {}
