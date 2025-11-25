import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceImageDto {
  @ApiProperty({ description: 'Image URL' })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class ServiceVideoDto {
  @ApiProperty({ description: 'Video URL' })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateServiceDto {
  @ApiProperty({ description: 'Service title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Service category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags (comma separated)' })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional({ description: 'Service provider name' })
  @IsString()
  @IsOptional()
  serviceProvider?: string;

  @ApiPropertyOptional({ description: 'Service location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Service duration' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ description: 'Type of service' })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ description: 'What is included in the service' })
  @IsString()
  @IsOptional()
  whatsIncluded?: string;

  @ApiPropertyOptional({ description: 'Target audience description' })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiPropertyOptional({ description: 'Service price' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Compare at price' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({ description: 'Cost per service' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerService?: number;

  @ApiProperty({ description: 'Store ID' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiPropertyOptional({
    description: 'Service images',
    type: [ServiceImageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceImageDto)
  @IsOptional()
  images?: ServiceImageDto[];

  @ApiPropertyOptional({
    description: 'Service videos',
    type: [ServiceVideoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceVideoDto)
  @IsOptional()
  videos?: ServiceVideoDto[];

  @ApiPropertyOptional({
    description: 'Service status',
    default: 'DRAFT',
    enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class PatchServiceDto {
  @ApiPropertyOptional({ description: 'Service price' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Compare at price' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({ description: 'Cost per service' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerService?: number;

  @ApiPropertyOptional({
    description: 'Service status',
    enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class ServiceQueryDto {
  @ApiProperty({ description: 'Store ID to filter services' })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class ServiceVariationResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}

export class ServiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  comparePrice?: number;

  @ApiPropertyOptional()
  costPerItem?: number;

  @ApiPropertyOptional()
  status?: string;

  @ApiProperty({ type: [ServiceImageDto] })
  images: ServiceImageDto[];

  @ApiProperty({ type: [ServiceVideoDto] })
  videos: ServiceVideoDto[];

  @ApiProperty({ type: [ServiceVariationResponseDto] })
  variations: ServiceVariationResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
