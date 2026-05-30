import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findOne() {
    return this.prisma.company.findFirst();
  }

  async create(data: {
    name: string;
    gstNumber: string;
    phone: string;
    address: string;
  }) {
    return this.prisma.company.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name: string;
      gstNumber: string;
      phone: string;
      address: string;
    },
  ) {
    return this.prisma.company.update({
      where: {
        id,
      },
      data,
    });
  }
}