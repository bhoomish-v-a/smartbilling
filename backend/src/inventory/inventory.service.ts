import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}



async getAllStock() {
  const products =
    await this.prisma.product.findMany();

  const result: {
  productId: string;
  productName: string;
  purchased: number;
  sold: number;
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

    const purchasedQty =
      purchases._sum.quantity ?? 0;

    const soldQty =
      sold._sum.quantity ?? 0;

    result.push({
      productId: product.id,
      productName: product.name,
      purchased: purchasedQty,
      sold: soldQty,
      available:
        purchasedQty - soldQty,
    });
  }

  return result;
}

async getStock(productId: string) {
  const purchases =
    await this.prisma.purchase.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId,
      },
    });

  const sold =
    await this.prisma.invoiceItem.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId,
      },
    });

  const purchasedQty =
    purchases._sum.quantity ?? 0;

  const soldQty =
    sold._sum.quantity ?? 0;

  return {
    productId,
    purchased: purchasedQty,
    sold: soldQty,
    available:
      purchasedQty - soldQty,
  };
}
}