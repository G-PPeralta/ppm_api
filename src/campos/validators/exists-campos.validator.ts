import { Injectable } from '@nestjs/common';
import { CampoRepository } from '../repositories/campo.repository';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'CampoExists', async: true })
@Injectable()
export class CampoExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: CampoRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Campo doesn't exist`;
  }
}

export function CampoExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CampoExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CampoExistsRule,
    });
  };
}
