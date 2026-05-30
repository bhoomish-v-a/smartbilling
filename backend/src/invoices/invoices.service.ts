import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(
    createInvoiceDto: CreateInvoiceDto,
  ) {
    const invoiceNumber = `INV-${Date.now()}`;

    let grandTotal = 0;

    const invoiceItems: any[] = [];

    for (const item of createInvoiceDto.items) {
      const product =
        await this.prisma.product.findUnique({
          where: {
            id: item.productId,
          },
        });

      if (!product) {
        throw new BadRequestException(
          'Product not found',
        );
      }

      const purchases =
        await this.prisma.purchase.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: item.productId,
          },
        });

      const sold =
        await this.prisma.invoiceItem.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: item.productId,
          },
        });

      const purchasedQty =
        purchases._sum.quantity ?? 0;

      const soldQty =
        sold._sum.quantity ?? 0;

      const availableQty =
        purchasedQty - soldQty;

      if (item.quantity > availableQty) {
        throw new BadRequestException(
          `${product.name} stock unavailable`,
        );
      }

      const subtotal =
        Number(product.price) * item.quantity;

      const gstAmount =
        subtotal *
        (Number(product.gstPercentage) / 100);

      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      const total =
        subtotal + gstAmount;

      grandTotal += total;

      invoiceItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        gstPercentage:
          product.gstPercentage,
        cgstAmount: cgst,
        sgstAmount: sgst,
        total,
      });
    }

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName:
          createInvoiceDto.customerName,
        customerPhone:
          createInvoiceDto.customerPhone,
        billType: 'GST',
        totalAmount: grandTotal,
        items: {
          create: invoiceItems,
        },
      },
      include: {
        items: true,
      },
    });
  }
}