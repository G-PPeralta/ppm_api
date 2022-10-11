import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetReal } from './dto/creat-budget-real.dto';
import { BudgetPlan } from './dto/create-budget-plan.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

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

  @Get('/poco/:id')
  getNome(@Param('id') id: string) {
    return this.budgetsService.getSondaNome(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(+id);
  }

  @Patch(':id/:campo/:valor')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
  ) {
    return this.budgetsService.update(+id, campo, valor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(+id);
  }
}
