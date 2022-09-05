import { PoloExists } from '../../polo/validators/exists-polo.validator';

export class CreateCampoDto {
  campo: string;

  @PoloExists()
  poloId: number;
}
