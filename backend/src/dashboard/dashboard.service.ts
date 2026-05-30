import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async summary() {
    const productCount =
      await this.prisma.product.count();

    const purchaseCount =
      await this.prisma.purchase.count();

    const invoiceCount =
      await this.prisma.invoice.count();

    const sales =
      await this.prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
        },
      });

    const products =
      await this.prisma.product.findMany();

    const lowStockProducts: {
      name: string;
      available: number;
    }[] = [];

    for (const product of products) {
      const purchases =
        await this.prisma.purchase.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: product.id,
          },
        });

      const sold =
        await this.prisma.invoiceItem.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: product.id,
          },
        });

      const available =
        (purchases._sum.quantity ?? 0) -
        (sold._sum.quantity ?? 0);

      if (available <= 10) {
        lowStockProducts.push({
          name: product.name,
          available,
        });
      }
    }

    return {
      products: productCount,
      purchases: purchaseCount,
      invoices: invoiceCount,
      sales:
        Number(
          sales._sum.totalAmount,
        ) || 0,
      lowStockProducts,
    };
  }
}