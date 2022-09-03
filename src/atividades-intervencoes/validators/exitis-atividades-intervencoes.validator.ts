import { Injectable } from '@nestjs/common';
import { AtividadeIntervencaoRepository } from '../repository/atividades-invervencoes.repository';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtividadeIntervencaoExists', async: true })
@Injectable()
export class AtividadeIntervencaoExistsRule
  implements ValidatorConstraintInterface
{
  constructor(private repo: AtividadeIntervencaoRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Area de Atuação doesn't exist`;
  }
}

export function AtividadeIntervencaoExists(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'AtividadeIntervencaoExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: AtividadeIntervencaoExistsRule,
    });
  };
}
