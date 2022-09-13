import { Injectable } from '@nestjs/common';
import { AtividadesPretendentes } from './dto/atividades-precedentes.dto';
import { CreateAtividadesIntervencoeDto } from './dto/create-atividades-intervencao.dto';
import { SaveAtividadesIntervencoeDto } from './dto/save-atividades-intervencoes-dto';
import { SaveAtividadesPrecedentesDto } from './dto/save-atividades-precedentes.dto';
import { UpdateAtividadesIntervencoeDto } from './dto/update-atividades-intervencao.dto';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';

@Injectable()
export class AtividadesIntervencoesService {
  constructor(private readonly repo: AtividadeIntervencaoRepository) {}
  async create(
    _createAtividadesIntervencoeDto: CreateAtividadesIntervencoeDto,
  ) {
    try {
      const atividade: SaveAtividadesIntervencoeDto = {
        nome: _createAtividadesIntervencoeDto.nome,
        areaAtuacaoId: _createAtividadesIntervencoeDto.areaAtuacaoId,
        obs: _createAtividadesIntervencoeDto.obs,
        tarefaId: _createAtividadesIntervencoeDto.tarefaId,
        ...this.gerarAtividadesPrecentesPayload(
          _createAtividadesIntervencoeDto.atividadesPrecedentes,
        ),
      };

      await this.repo.save(atividade);
      return 'Atividades Intervencoes salvo com sucesso';
    } catch (e) {
      return 'erro ao sentar salvar atividades intervencao.';
    }
  }

  async findAll() {
    const atividadesList = await this.repo.atividadesist();

    return atividadesList;
  }

  findOne(id: number) {
    return `This action returns a #${id} atividadesIntervencoe`;
  }

  update(
    id: number,
    updateAtividadesIntervencoeDto: UpdateAtividadesIntervencoeDto,
  ) {
    return `This action updates a #${id} atividadesIntervencoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividadesIntervencoe`;
  }

  private gerarAtividadesPrecentesPayload(d: AtividadesPretendentes[]) {
    if (d !== null) {
      const payLoad: SaveAtividadesPrecedentesDto = {
        precedentes: {
          create: [],
        },
      };
      for (const f in d) {
        const r = {
          ordem: d[f].ordem,
          atividadePrecedente: {
            connect: {
              id: d[f].atividaeId,
            },
          },
        };
        payLoad.precedentes.create.push(r);
      }

      return payLoad;
    } else {
      return null;
    }
  }
}
