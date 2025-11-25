import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsObject, IsArray, Min, MaxLength, MinLength, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CampaignType, CampaignStatus } from '@prisma/client';

// Type-specific data classes
export class InfluencerLocationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;
}

export class CampaignTargetsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  awareness?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  advocacy?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  conversions?: string[];
}

export class CreateCampaignDto {
  @ApiProperty({ description: 'Campaign title', minLength: 3, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: 'Campaign description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Campaign budget', minimum: 0 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'UGX' })
  @IsString()
  @IsOptional()
  currency?: string = 'UGX';

  @ApiPropertyOptional({ description: 'Campaign duration in days' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ description: 'Target influencer location', type: InfluencerLocationDto })
  @IsObject()
  @IsOptional()
  @Type(() => InfluencerLocationDto)
  influencerLocation?: InfluencerLocationDto;

  @ApiPropertyOptional({ description: 'Target platforms', type: [String] })
  @IsArray()
  @IsOptional()
  platforms?: string[];

  @ApiPropertyOptional({ description: 'Campaign targets', type: CampaignTargetsDto })
  @IsObject()
  @IsOptional()
  @Type(() => CampaignTargetsDto)
  targets?: CampaignTargetsDto;

  @ApiProperty({ 
    description: 'Campaign type', 
    enum: ['PRODUCT', 'COUPON', 'VIDEO', 'PROFILE'],
    default: 'PRODUCT'
  })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType = CampaignType.PRODUCT;

  @ApiPropertyOptional({ description: 'Type-specific data (JSON object)' })
  @IsObject()
  @IsOptional()
  typeSpecificData?: Record<string, any>;
}

export class CampaignQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: CampaignStatus })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @ApiPropertyOptional({ description: 'Filter by type', enum: CampaignType })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;
}

export class CampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  budget: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  influencerLocation?: any;

  @ApiPropertyOptional()
  platforms?: any;

  @ApiPropertyOptional()
  targets?: any;

  @ApiProperty({ enum: CampaignStatus })
  status: CampaignStatus;

  @ApiProperty({ enum: CampaignType })
  type: CampaignType;

  @ApiPropertyOptional()
  typeSpecificData?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Applicant count' })
  _count?: { applicants: number };

  @ApiPropertyOptional({ description: 'Brand information' })
  brand?: {
    id: string;
    name: string;
    logo: string | null;
  };
}

// Update Campaign DTO (partial of CreateCampaignDto)
export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

// Products Query DTO
export class ProductsQueryDto {
  @ApiPropertyOptional({ description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Product status filter', default: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string = 'ACTIVE';
}
