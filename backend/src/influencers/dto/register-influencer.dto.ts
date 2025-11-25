import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, Min, ArrayMinSize, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialPlatform } from '@prisma/client';

export class SocialAccountDto {
  @ApiProperty({ 
    description: 'Social media platform', 
    enum: SocialPlatform,
    example: 'INSTAGRAM'
  })
  @IsEnum(SocialPlatform)
  @IsNotEmpty()
  platform: SocialPlatform;

  @ApiProperty({ description: 'Social media handle/username' })
  @IsString()
  @IsNotEmpty()
  handle: string;

  @ApiProperty({ description: 'Number of followers', example: 10000 })
  @IsNumber()
  @Min(0)
  followerCount: number;

  @ApiProperty({ description: 'Profile URL', required: false })
  @IsString()
  @IsOptional()
  profileUrl?: string;
}

export class RegisterInfluencerDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Primary niche/category' })
  @IsString()
  @IsNotEmpty()
  primaryNiche: string;

  @ApiProperty({ description: 'Bio/description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Social media accounts', type: [SocialAccountDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one social account is required' })
  @ValidateNested({ each: true })
  @Type(() => SocialAccountDto)
  socialAccounts: SocialAccountDto[];
}
