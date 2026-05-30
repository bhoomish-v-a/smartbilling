import {
  IsString,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';

import { PurchaseType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  gstPercentage: number;

  @IsEnum(PurchaseType)
  purchaseType: PurchaseType;
}