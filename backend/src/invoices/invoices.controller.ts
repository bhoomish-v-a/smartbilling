import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { PdfService } from '../pdf/pdf.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
  ) {}

  @Post()
  create(
    @Body()
    createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(
      createInvoiceDto,
    );
  }
@Get(':id/pdf')
async downloadPdf(
  @Param('id') id: string,
  @Res() res: Response,
) {
  const invoice =
    await this.invoicesService.findOne(
      id,
    );

  PdfService.generateInvoice(
    invoice,
    res,
  );
}
  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.invoicesService.findOne(id);
  }
}