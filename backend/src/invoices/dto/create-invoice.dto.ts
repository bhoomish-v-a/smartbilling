import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  ValidateNested,
  IsInt,
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
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  billType?: 'GST' | 'ESTIMATION';

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}
