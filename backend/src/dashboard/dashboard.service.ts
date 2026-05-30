import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [productCount, purchaseCount, invoiceCount, sales, lowStock] =
      await Promise.all([
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.purchase.count(),
        this.prisma.invoice.count(),
        this.prisma.invoice.aggregate({
          _sum: { totalAmount: true },
        }),
        this.prisma.$queryRawUnsafe<{ name: string; available: bigint }[]>(
          `SELECT p."name", COALESCE(pur."purchased", 0) - COALESCE(s."sold", 0) AS "available"
           FROM "Product" p
           LEFT JOIN (SELECT "productId", SUM("quantity")::BIGINT AS "purchased" FROM "Purchase" GROUP BY "productId") pur
             ON pur."productId" = p."id"
           LEFT JOIN (SELECT "productId", SUM("quantity")::BIGINT AS "sold" FROM "InvoiceItem" GROUP BY "productId") s
             ON s."productId" = p."id"
           WHERE (COALESCE(pur."purchased", 0) - COALESCE(s."sold", 0)) <= 10
           ORDER BY "available"
           LIMIT 20`,
        ),
      ]);

    return {
      products: productCount,
      purchases: purchaseCount,
      invoices: invoiceCount,
      sales: Number(sales._sum.totalAmount) || 0,
      lowStockProducts: lowStock.map((p) => ({
        name: p.name,
        available: Number(p.available),
      })),
    };
  }
}
