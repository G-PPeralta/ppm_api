import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { PoloRepository } from '../repositories/polo.repository';

@ValidatorConstraint({ name: 'PoloExists', async: true })
@Injectable()
export class PoloExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: PoloRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Polo doesn't exist`;
  }
}

export function PoloExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'PoloExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PoloExistsRule,
    });
  };
}
