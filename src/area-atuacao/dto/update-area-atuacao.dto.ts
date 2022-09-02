import { PartialType } from '@nestjs/swagger';
import { CreateAreaAtuacaoDto } from './create-area-atuacao.dto';

export class UpdateAreaAtuacaoDto extends PartialType(CreateAreaAtuacaoDto) {}
