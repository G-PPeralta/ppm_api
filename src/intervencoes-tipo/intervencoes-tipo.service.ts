import { Injectable } from '@nestjs/common';
import {
  CreateAtividade,
  CreateIntervencoesTipoDto,
} from './dto/create-intervencoes-tipo.dto';
import { SaveAtividadesDto } from './dto/save-atividades.dto';
import { SaveIntervencaoTipoDto } from './dto/save-intervencoes-tipo.dto';
import { UpdateIntervencoesTipoDto } from './dto/update-intervencoes-tipo.dto';
import { IntervencaoTipoRepository } from './repository/intervencao-tipo.repository';

@Injectable()
export class IntervencoesTipoService {
  constructor(private repo: IntervencaoTipoRepository) {}

  async create(_createIntervencoesTipoDto: CreateIntervencoesTipoDto) {
    try {
      const atividadeData: SaveIntervencaoTipoDto = {
        nome: _createIntervencoesTipoDto.nome,
        obs: _createIntervencoesTipoDto.obs,
        ...this.gerarAtividadesIntevencoesPayload(
          _createIntervencoesTipoDto.atividades,
        ),
      };
      console.log(atividadeData);
      //await this.repo.save(atividadeData);
      return 'Atividades Intervencoes salvo com sucesso';
    } catch (e) {
      console.error(e);
      return 'erro ao sentar salvar atividades intervencao.';
    }
  }

  findAll() {
    return this.repo.IntervencoesTiposList();
  }

  findOne(id: number) {
    return `This action returns a #${id} intervencoesTipo`;
  }

  update(id: number, _updateIntervencoesTipoDto: UpdateIntervencoesTipoDto) {
    return `This action updates a #${id} intervencoesTipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} intervencoesTipo`;
  }

  private gerarAtividadesIntevencoesPayload(
    d: CreateAtividade[],
  ): SaveAtividadesDto {
    if (d !== null) {
      const payLoad: SaveAtividadesDto = {
        atividades: {
          create: [],
        },
      };
      for (const f in d) {
        const r = {
          ordem: d[f].ordem,
          atividade: {
            connect: {
              id: d[f].atividaeId,
            },
          },
        };
        payLoad.atividades.create.push(r);
      }

      return payLoad;
    } else {
      return null;
    }
  }
}
