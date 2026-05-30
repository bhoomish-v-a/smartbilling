import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  findOne() {
    return this.companyService.findOne();
  }

  @Post()
  create(
    @Body() body: any,
  ) {
    return this.companyService.create(
      body,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.companyService.update(
      id,
      body,
    );
  }
}