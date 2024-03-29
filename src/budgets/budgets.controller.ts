/**
 * CRIADO EM: 25/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado ao financeiro
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { BudgetsService } from './budgets.service';
import { BudgetReal } from './dto/creat-budget-real.dto';
import { BudgetPlan } from './dto/create-budget-plan.dto';
import { CustoDiarioDto } from './dto/custos-diarios.dto';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post('/orcamento-previsto')
  createPrevisto(@Body() updateBudgetPlan: BudgetPlan) {
    return this.budgetsService.updateBudgetPlan(updateBudgetPlan);
  }

  @Post('/orcamento-real')
  createReal(@Body() _updateBudgetReal: BudgetReal) {
    return this.budgetsService.createBudgetReal(_updateBudgetReal);
  }

  @Patch('/orcamento-real')
  updateOrcamentoReal(@Body() _updateBudgetReal: BudgetReal) {
    return this.budgetsService.updateBudgetReal(_updateBudgetReal);
  }

  @Delete('/orcamento-real/:id')
  deleteBudgetCost(@Param('id') id: string) {
    return this.budgetsService.deleteCusto(+id);
  }

  @Get()
  findAll() {
    return this.budgetsService.findAll();
  }

  @Get('/detail/:id')
  findDetailAll(@Param('id') id: string) {
    return this.budgetsService.findAllDetail(+id);
  }

  @Get('/projects')
  projects() {
    return this.budgetsService.findAllProjects();
  }

  @Post('/custoDiario/filho/:id')
  custosDiarios(@Param('id') id: string, @Body() _custoDiario: CustoDiarioDto) {
    return this.budgetsService.custosDiariosFilhoList(id, _custoDiario);
  }

  @Post('/custoDiario/pai/:id')
  custosDiariosPai(
    @Param('id') id: string,
    @Body() _custoDiario: CustoDiarioDto,
  ) {
    return this.budgetsService.custosDiariosPaiList(id, _custoDiario);
  }

  @Get('/custoDiario/:id')
  getCustosDiario(@Param('id') id: string) {
    return this.budgetsService.getCustoDiario(id);
  }
}
