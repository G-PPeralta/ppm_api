import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { IntervencaoTipoRepository } from '../repository/intervencao-tipo.repository';

@ValidatorConstraint({ name: 'IntervencaoTipoExists', async: true })
@Injectable()
export class IntervencaoTipoExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: IntervencaoTipoRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Intervencao Tipo doesn't exist`;
  }
}

export function IntervencaoTipoExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IntervencaoTipoExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IntervencaoTipoExistsRule,
    });
  };
}
