import { Injectable } from '@nestjs/common';
import { AreaAtuacaoRepository } from '../repository/area-atuacao.repository';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'AreaAtuacaoExists', async: true })
@Injectable()
export class AreaAtuacaoExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: AreaAtuacaoRepository) {}

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

export function AreaAtuacaoExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'AreaAtuacaoExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: AreaAtuacaoExistsRule,
    });
  };
}
