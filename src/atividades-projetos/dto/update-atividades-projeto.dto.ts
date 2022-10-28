import { PartialType } from '@nestjs/swagger';
import { CreateAtividadesProjetoDto } from './create-atividades-projeto.dto';

export class UpdateAtividadesProjetoDto extends PartialType(
  CreateAtividadesProjetoDto,
) {}
