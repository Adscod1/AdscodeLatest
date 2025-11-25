import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Store ID to review' })
  @IsString()
  storeId: string;

  @ApiProperty({ description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review comment' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ description: 'Comma-separated image URLs' })
  @IsString()
  @IsOptional()
  images?: string;

  @ApiPropertyOptional({ description: 'Comma-separated video URLs' })
  @IsString()
  @IsOptional()
  videos?: string;
}

export class ReviewUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  image?: string;
}

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiPropertyOptional()
  images?: string;

  @ApiPropertyOptional()
  videos?: string;

  @ApiProperty({ type: ReviewUserDto })
  user: ReviewUserDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
