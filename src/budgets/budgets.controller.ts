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
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  findAll() {
    return this.budgetsService.findAll();
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