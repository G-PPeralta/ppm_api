/**
 * CRIADO EM: 03/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Serviço relacionado a atividades de intervenção
 */

import { Injectable } from '@nestjs/common';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';

@Injectable()
export class AtividadesIntervencoesService {
  constructor(private readonly repo: AtividadeIntervencaoRepository) {}

  async findAll() {
    const atividadesList = await this.repo.atividadesist();
    return atividadesList.map((atividade) => {
      return { ...atividade, tarefa: atividade.tarefa.tarefa };
    });
  }
}
