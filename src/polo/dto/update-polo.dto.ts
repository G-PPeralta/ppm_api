import { PartialType } from '@nestjs/swagger';
import { CreatePoloDto } from './create-polo.dto';

export class UpdatePoloDto extends PartialType(CreatePoloDto) {}
