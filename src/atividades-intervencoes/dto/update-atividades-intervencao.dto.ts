import { PartialType } from '@nestjs/swagger';
import { CreateAtividadesIntervencoeDto } from './create-atividades-intervencao.dto';

export class UpdateAtividadesIntervencoeDto extends PartialType(
  CreateAtividadesIntervencoeDto,
) {}
