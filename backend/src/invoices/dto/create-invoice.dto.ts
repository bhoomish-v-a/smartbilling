import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateInvoiceDto {
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}