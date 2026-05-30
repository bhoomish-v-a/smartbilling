import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createPurchaseDto: CreatePurchaseDto,
  ) {
    return this.prisma.purchase.create({
      data: {
        productId: createPurchaseDto.productId,
        quantity: createPurchaseDto.quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async findAll() {
    return this.prisma.purchase.findMany({
      include: {
        product: true,
      },
    });
  }
}