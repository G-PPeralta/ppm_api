import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { PocoRepository } from '../repositories/poco.repository';

@ValidatorConstraint({ name: 'PocoExists', async: true })
@Injectable()
export class PocoExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: PocoRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Poço doesn't exist`;
  }
}

export function PocoExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'PocoExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PocoExistsRule,
    });
  };
}
