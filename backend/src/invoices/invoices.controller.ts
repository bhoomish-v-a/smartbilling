import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
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
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(
    @Body()
    createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.invoicesService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const invoice = await this.invoicesService.findOne(id);
    PdfService.generateInvoice(
      {
        invoiceNumber: invoice.invoiceNumber,
        createdAt: invoice.createdAt,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        totalAmount: Number(invoice.totalAmount),
        discount: Number(invoice.discount),
        items: invoice.items.map((i) => ({
          product: i.product ? { name: i.product.name } : null,
          quantity: i.quantity,
          price: Number(i.price),
          gstPercentage: Number(i.gstPercentage),
          total: Number(i.total),
        })),
      },
      res,
    );
  }
}
