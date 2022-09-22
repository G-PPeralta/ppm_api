import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  constructor(private prismaClient: PrismaService) {}
  async create(createProjetoDto: CreateProjetoDto) {
    return await this.prismaClient.projeto.create({
      data: {
        ...createProjetoDto,
        dataFim: new Date(createProjetoDto.dataFim),
        dataFimReal: new Date(createProjetoDto.dataFimReal),
        dataInicio: new Date(createProjetoDto.dataInicio),
        dataInicioReal: new Date(createProjetoDto.dataInicioReal),
      },
    });
  }

  async findAllProjetosPrazos() {
    return this.prismaClient.$queryRawUnsafe(`
    select 
      *,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  order by id_pai asc, dat_ini_plan asc;`);
  }

  async findProjetosPrazos(id: number) {
    return this.prismaClient.$queryRawUnsafe(`    
   select 
      *,
      dev.fn_hrs_uteis_totais_atv(dat_ini_plan, dat_fim_plan) as hrs_totais,
      case when dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) is null then 0 else dev.fn_hrs_uteis_totais_atv(dat_ini_real, dat_fim_real) end as hrs_reais,
      0.00 as vlr_custo
  from dev.tb_projetos_atividade a
  where id_projeto = ${id}
  order by id_pai asc, dat_ini_plan asc;
    `);
  }

  async findProjetosPercentuais(id: number) {
    return this.prismaClient.$queryRawUnsafe(`
    select 
    *,
    round(dev.fn_cron_calc_pct_plan(b.id),1) as pct_plan,
    round(dev.fn_cron_calc_pct_real(b.id),1) as pct_real
from dev.tb_projetos a
left join dev.tb_projetos_atividade b 
    on a.id = b.id_projeto 
where 
    b.id_pai = 0 or b.id_pai is null
and a.id = ${id};
`);
  }

  async findAll() {
    const projects = await this.prismaClient.projeto.findMany();
    if (!projects) throw new Error('Falha na listagem de projetos');
    return projects;
  }

  async findTotalValue(id: number) {
    const totalValue = await this.prismaClient.$queryRaw(Prisma.sql`
    select
      id,
      data_inicio_formatada,
      data_fim_formatada,
      meses,
      valor_total_previsto
    from
        dev.v_grafico_curva_s
    where
        data_fim > data_inicio
        and valor_total_previsto is not null
        and id = ${id};`);
    if (!totalValue) throw new Error('Valor total previsto não existe');
    return totalValue;
  }

  async findOne(id: number) {
    const project = await this.prismaClient.projeto.findUnique({
      where: { id },
    });
    return project;
  }

  async update(id: number, updateProjetoDto: UpdateProjetoDto) {
    await this.prismaClient.projeto.update({
      where: {
        id,
      },
      data: updateProjetoDto,
    });

    return `This action updates a #${id} projeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async countAll() {
    const count = await this.prismaClient.projeto.count();
    if (!count) throw new Error('Falha na contagem de projetos');
    return count;
  }
}
