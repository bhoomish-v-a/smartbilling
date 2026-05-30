import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findOne() {
    return this.companyService.findOne();
  }

  @Post()
  @Roles('ADMIN')
  create(
    @Body()
    body: {
      name: string;
      gstNumber: string;
      phone: string;
      address: string;
    },
  ) {
    return this.companyService.create(body);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      gstNumber?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.companyService.update(id, body);
  }
}
