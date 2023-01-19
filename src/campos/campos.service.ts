/**
 * CRIADO EM: 09/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado aos campos
 */
import { Injectable } from '@nestjs/common';
import { CampoRepository } from './repositories/campo.repository';

@Injectable()
export class CamposService {
  constructor(private repo: CampoRepository) {}

  findAll() {
    try {
      return this.repo.camposList();
    } catch (e) {
      return 'não é possivel retornar lista  no momento';
    }
  }
}
