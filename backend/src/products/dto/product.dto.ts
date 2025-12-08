import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductVariationDto {
  @ApiProperty({ description: 'Variation name (e.g., Size, Color)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Variation value (e.g., Large, Red)' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Price for this variation' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class ProductMediaDto {
  @ApiProperty({ description: 'URL of the media file' })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class ProductBenefitDto {
  @ApiProperty({ description: 'Benefit title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Benefit description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ProductIngredientDto {
  @ApiProperty({ description: 'Ingredient name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Ingredient image URL' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Ingredient description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ProductFaqDto {
  @ApiProperty({ description: 'FAQ question' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ description: 'FAQ answer' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Product category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Vendor name' })
  @IsString()
  @IsOptional()
  vendor?: string;

  @ApiPropertyOptional({ description: 'Tags (comma-separated)' })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Compare at price' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({ description: 'Cost per item' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerItem?: number;

  @ApiPropertyOptional({ description: 'Product variations', type: [ProductVariationDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationDto)
  variations?: ProductVariationDto[];

  @ApiPropertyOptional({ description: 'Product images', type: [ProductMediaDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductMediaDto)
  images?: ProductMediaDto[];

  @ApiPropertyOptional({ description: 'Product videos', type: [ProductMediaDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductMediaDto)
  videos?: ProductMediaDto[];

  @ApiPropertyOptional({ description: 'Weight' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Weight unit (kg, lb, etc.)' })
  @IsString()
  @IsOptional()
  weightUnit?: string;

  @ApiPropertyOptional({ description: 'Length' })
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiPropertyOptional({ description: 'Width' })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ description: 'Height' })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Size unit (cm, in, etc.)' })
  @IsString()
  @IsOptional()
  sizeUnit?: string;

  @ApiPropertyOptional({ description: 'Country of origin' })
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @ApiPropertyOptional({ description: 'Harmonized system code' })
  @IsString()
  @IsOptional()
  harmonizedSystemCode?: string;

  @ApiPropertyOptional({ description: 'Product status (DRAFT, ACTIVE, etc.)', default: 'DRAFT' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Store ID' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiPropertyOptional({ description: 'Benefits introduction text' })
  @IsString()
  @IsOptional()
  benefitsIntroText?: string;

  @ApiPropertyOptional({ description: 'Benefits section image URL' })
  @IsString()
  @IsOptional()
  benefitsSectionImage?: string;

  @ApiPropertyOptional({ description: 'Product benefits', type: [ProductBenefitDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductBenefitDto)
  benefitItems?: ProductBenefitDto[];

  @ApiPropertyOptional({ description: 'Product ingredients', type: [ProductIngredientDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductIngredientDto)
  ingredientItems?: ProductIngredientDto[];

  @ApiPropertyOptional({ description: 'How to use video URL' })
  @IsString()
  @IsOptional()
  howToUseVideo?: string;

  @ApiPropertyOptional({ description: 'How to use description' })
  @IsString()
  @IsOptional()
  howToUseDescription?: string;

  @ApiPropertyOptional({ description: 'Product FAQs', type: [ProductFaqDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductFaqDto)
  faqItems?: ProductFaqDto[];
}

export class UpdateProductDto extends CreateProductDto {}

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
