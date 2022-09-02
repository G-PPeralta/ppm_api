import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { PrismaService } from 'services/prisma/prisma.service';

@ValidatorConstraint({ name: 'AreaAtuacaoExists', async: true })
@Injectable()
export class AreaAtuacaoExistsRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: number) {
    try {
      await this.prisma.areaAtuacao.findFirstOrThrow({
        where: { id: value },
      });
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
