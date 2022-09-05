import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { SondaRepository } from '../repository/sonda-repository';

@ValidatorConstraint({ name: 'SondaExists', async: true })
@Injectable()
export class SondaExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: SondaRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Sonda doesn't exist`;
  }
}

export function SondaExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SondaExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SondaExistsRule,
    });
  };
}
