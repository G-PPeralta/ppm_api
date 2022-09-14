import { Injectable } from '@nestjs/common';
import {
  Atividades,
  CreateProjetoIntervencaoDto,
} from './dto/create-projeto-intervencao.dto';
import {
  AtividadesPrecedentesRelacao,
  SaveAtividadesPrecedentesDto,
  SaveProjetoIntervencaoDTO,
} from './dto/save-projeto-intervencao.dto';
import { UpdateProjetoIntervencaoDto } from './dto/update-projeto-intervencao.dto';
import { ProjetoIntervencaoRepository } from './repository/projeto-invervencoes.repository';

@Injectable()
export class ProjetoIntervencaoService {
  constructor(private repo: ProjetoIntervencaoRepository) {}

  create(_createProjetoIntervencaoDto: CreateProjetoIntervencaoDto) {
    const projetoIntervencaoData = {
      obs: _createProjetoIntervencaoDto.comentarios,
      nome: _createProjetoIntervencaoDto.nome,
      ...this.gerarAtividadesPayload(_createProjetoIntervencaoDto.atividades),
    }; /// as SaveProjetoIntervencaoDTO

    //console.log(projetoIntervencaoData);
    return this.repo.save(projetoIntervencaoData);
  }

  findAll() {
    return this.repo.projetoList();
  }

  findOne(id: number) {
    return `This action returns a #${id} projetoIntervencao`;
  }

  update(id: number, updateProjetoIntervencaoDto: UpdateProjetoIntervencaoDto) {
    return `This action updates a #${id} projetoIntervencao`;
  }

  remove(id: number) {
    return `This action removes a #${id} projetoIntervencao`;
  }

  private gerarAtividadesPayload(atividadesList: Atividades[]) {
    if (atividadesList !== null) {
      const payLoad: SaveAtividadesPrecedentesDto = {
        atividades: {
          create: [],
        },
      };

      for (const atividade in atividadesList) {
        const precedentes: AtividadesPrecedentesRelacao[] = atividadesList[
          atividade
        ].precedentes.map((id) => {
          return {
            atividade: {
              connect: {
                id,
              },
            },
          };
        });

        const tuple = {
          ordem: atividadesList[atividade].ordem,
          atividade: {
            connect: {
              id: atividadesList[atividade].atividadeId,
            },
          },
          precedentes: {
            create: precedentes,
          },
        };
        payLoad.atividades.create.push(tuple);
      }

      return payLoad;
    } else {
      return null;
    }
  }
}
