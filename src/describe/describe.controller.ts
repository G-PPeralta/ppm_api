import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { DescribeService } from './describe.service';

@UseGuards(JwtAuthGuard)
@Controller('describe')
export class DescribeController {
  constructor(private readonly service: DescribeService) {}

  @Get(':table')
  describeTable(@Param('table') table: string) {
    return this.service.describeTable(table);
  }
}
