import { IsString, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';

import { PurchaseType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  gstPercentage: number;

  @IsEnum(PurchaseType)
  purchaseType: PurchaseType;
}
