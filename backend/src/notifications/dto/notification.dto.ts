import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationQueryDto {
  @ApiPropertyOptional({ description: 'Maximum number of notifications', default: 20 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Only return unread notifications', default: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  unreadOnly?: boolean = false;
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID to notify' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Notification type',
    enum: ['CAMPAIGN_SELECTION', 'APPLICATION_UPDATE', 'SYSTEM'],
  })
  @IsString()
  type: 'CAMPAIGN_SELECTION' | 'APPLICATION_UPDATE' | 'SYSTEM';

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Link to navigate when clicked' })
  @IsString()
  @IsOptional()
  link?: string;
}

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  link?: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
