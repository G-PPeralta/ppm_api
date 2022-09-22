import { PartialType } from '@nestjs/swagger';
import { CreateDetalhamentoDto } from './create-detalhamento.dto';

export class UpdateDetalhamentoDto extends PartialType(CreateDetalhamentoDto) {}
