import { PartialType } from '@nestjs/swagger';
import { CreateAtividadeCampanhaDto } from './create-atividade-campanha.dto';

export class UpdateAtividadeCampanhaDto extends PartialType(
  CreateAtividadeCampanhaDto,
) {}
