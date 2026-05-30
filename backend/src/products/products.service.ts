import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }
  async update(
  id: string,
  updateProductDto: any,
) {
  return this.prisma.product.update({
    where: {
      id,
    },
    data: updateProductDto,
  });
}

async remove(id: string) {
  return this.prisma.product.delete({
    where: {
      id,
    },
  });
}

  async findAll() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
    });
  }
}