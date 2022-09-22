import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ResponsavelRepository } from '../repository/responsavel.repository';

@ValidatorConstraint({ name: 'ResponsavelExists', async: true })
@Injectable()
export class ResponsavelExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: ResponsavelRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Responsavel doesn't exist`;
  }
}

export function ResponsavelExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ResponsavelExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ResponsavelExistsRule,
    });
  };
}
