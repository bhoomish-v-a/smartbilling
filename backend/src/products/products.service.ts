import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        gstPercentage: createProductDto.gstPercentage,
        purchaseType: createProductDto.purchaseType,
        isActive: true,
        category: createProductDto.categoryId
          ? { connect: { id: createProductDto.categoryId } }
          : undefined,
      },
      include: { category: true },
    });
  }

  async update(id: string, updateProductDto: Record<string, unknown>) {
    const categoryId = updateProductDto.categoryId as string | undefined;
    const rest: Record<string, unknown> = {};
    for (const key of Object.keys(updateProductDto)) {
      if (key !== 'categoryId') {
        rest[key] = updateProductDto[key];
      }
    }
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(rest as object),
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
      include: { category: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
    });
  }
}
