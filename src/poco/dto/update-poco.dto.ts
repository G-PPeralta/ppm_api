import { PartialType } from '@nestjs/swagger';
import { CreatePocoDto } from './create-poco.dto';

export class UpdatePocoDto extends PartialType(CreatePocoDto) {}
