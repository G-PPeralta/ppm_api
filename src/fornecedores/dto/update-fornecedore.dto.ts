import { PartialType } from '@nestjs/swagger';
import { CreateFornecedoreDto } from './create-fornecedore.dto';

export class UpdateFornecedoreDto extends PartialType(CreateFornecedoreDto) {}
