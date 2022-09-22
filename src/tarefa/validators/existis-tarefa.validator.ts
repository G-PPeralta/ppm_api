import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { TarefaRepository } from '../repository/tarefa.repository';

@ValidatorConstraint({ name: 'TarefaExists', async: true })
@Injectable()
export class TarefaExistsRule implements ValidatorConstraintInterface {
  constructor(private repo: TarefaRepository) {}

  async validate(value: number) {
    try {
      await this.repo.getOneOrFail(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Tarefa doesn't exist`;
  }
}

export function TarefaExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'TarefaExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: TarefaExistsRule,
    });
  };
}
