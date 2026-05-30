import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStock() {
    const result = await this.prisma.$queryRawUnsafe<
      {
        productId: string;
        productName: string;
        purchased: bigint;
        sold: bigint;
        available: bigint;
      }[]
    >(
      `SELECT
        p."id" AS "productId",
        p."name" AS "productName",
        COALESCE(pur."purchased", 0) AS "purchased",
        COALESCE(s."sold", 0) AS "sold",
        COALESCE(pur."purchased", 0) - COALESCE(s."sold", 0) AS "available"
      FROM "Product" p
      LEFT JOIN (
        SELECT "productId", SUM("quantity")::BIGINT AS "purchased"
        FROM "Purchase"
        GROUP BY "productId"
      ) pur ON pur."productId" = p."id"
      LEFT JOIN (
        SELECT "productId", SUM("quantity")::BIGINT AS "sold"
        FROM "InvoiceItem"
        GROUP BY "productId"
      ) s ON s."productId" = p."id"
      ORDER BY p."name"`,
    );

    return result.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      purchased: Number(r.purchased),
      sold: Number(r.sold),
      available: Number(r.available),
    }));
  }

  async getStock(productId: string) {
    const result = await this.prisma.$queryRawUnsafe<
      { purchased: bigint; sold: bigint; available: bigint }[]
    >(
      `SELECT
        COALESCE(pur."purchased", 0) AS "purchased",
        COALESCE(s."sold", 0) AS "sold",
        COALESCE(pur."purchased", 0) - COALESCE(s."sold", 0) AS "available"
      FROM (
        SELECT SUM("quantity")::BIGINT AS "purchased"
        FROM "Purchase"
        WHERE "productId" = $1
      ) pur,
      (
        SELECT SUM("quantity")::BIGINT AS "sold"
        FROM "InvoiceItem"
        WHERE "productId" = $1
      ) s`,
      productId,
    );

    return {
      productId,
      purchased: Number(result[0]?.purchased ?? 0),
      sold: Number(result[0]?.sold ?? 0),
      available: Number(result[0]?.available ?? 0),
    };
  }
}
