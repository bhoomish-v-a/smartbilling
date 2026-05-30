import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        skip,
        take: limit,
        include: {
          items: true,
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.invoice.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const lastInvoice = await this.prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    let nextNumber = 1;
    if (lastInvoice?.invoiceNumber) {
      const num = parseInt(lastInvoice.invoiceNumber.replace('INV-', ''), 10);
      if (!isNaN(num)) {
        nextNumber = num + 1;
      }
    }
    const invoiceNumber = `INV-${String(nextNumber).padStart(6, '0')}`;

    const discount = createInvoiceDto.discount || 0;
    let grandTotal = 0;
    const invoiceItems: any[] = [];

    for (const item of createInvoiceDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`${product.name} is inactive`);
      }

      const result = await this.prisma.$queryRawUnsafe<{ available: bigint }[]>(
        `SELECT COALESCE((
          SELECT SUM("quantity") FROM "Purchase" WHERE "productId" = $1
        ), 0) - COALESCE((
          SELECT SUM("quantity") FROM "InvoiceItem" WHERE "productId" = $1
        ), 0) AS "available"`,
        item.productId,
      );

      const availableQty = Number(result[0]?.available ?? 0);

      if (item.quantity > availableQty) {
        throw new BadRequestException(
          `${product.name} - only ${availableQty} in stock`,
        );
      }

      const subtotal = Number(product.price) * item.quantity;
      const gstAmount = subtotal * (Number(product.gstPercentage) / 100);
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      const total = subtotal + gstAmount;

      grandTotal += total;

      invoiceItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        gstPercentage: product.gstPercentage,
        cgstAmount: cgst,
        sgstAmount: sgst,
        total,
      });
    }

    grandTotal -= discount;

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName: createInvoiceDto.customerName,
        customerPhone: createInvoiceDto.customerPhone,
        customerId: createInvoiceDto.customerId || null,
        discount,
        billType: createInvoiceDto.billType || 'GST',
        totalAmount: Math.max(0, grandTotal),
        items: {
          create: invoiceItems,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });
  }
}
