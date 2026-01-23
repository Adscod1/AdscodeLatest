import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  SendMessageDto,
  StoreReplyDto,
  GetConversationsQueryDto,
  GetMessagesQueryDto,
  ConversationResponseDto,
  MessageResponseDto,
} from './dto/message.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================

  @Post('send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to a store (start or continue conversation)' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async sendMessageToStore(@UserId() userId: string, @Body() dto: CreateMessageDto) {
    const result = await this.messagesService.sendMessageToStore(userId, dto);
    return {
      success: true,
      ...result,
    };
  }

  @Post('conversation/:conversationId/send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message in an existing conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendMessage(
    @UserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() body: { content: string },
  ) {
    const message = await this.messagesService.sendMessage(userId, {
      conversationId,
      content: body.content,
    });
    return {
      success: true,
      message,
    };
  }

  @Get('conversations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    type: [ConversationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserConversations(
    @UserId() userId: string,
    @Query() query: GetConversationsQueryDto,
  ) {
    const result = await this.messagesService.getUserConversations(userId, query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('conversations/:conversationId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific conversation with messages' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationMessages(
    @UserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    const result = await this.messagesService.getConversationMessages(
      userId,
      conversationId,
      query,
      false,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get('unread-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread message count for user' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserUnreadCount(@UserId() userId: string) {
    const count = await this.messagesService.getUserUnreadCount(userId);
    return {
      success: true,
      count,
    };
  }

  @Get('store/:storeId/start')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get or create conversation with a store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved or created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getOrCreateConversation(
    @UserId() userId: string,
    @Param('storeId') storeId: string,
  ) {
    const conversation = await this.messagesService.getOrCreateConversation(userId, storeId);
    return {
      success: true,
      conversation,
    };
  }

  // ============================================================================
  // STORE OWNER ENDPOINTS
  // ============================================================================

  @Get('store/:storeId/conversations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store conversations (for store owners)' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store conversations retrieved successfully',
    type: [ConversationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You do not own this store' })
  async getStoreConversations(
    @UserId() userId: string,
    @Param('storeId') storeId: string,
    @Query() query: GetConversationsQueryDto,
  ) {
    const result = await this.messagesService.getStoreConversations(userId, storeId, query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('store/:storeId/conversations/:conversationId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store conversation messages (for store owners)' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation messages retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You do not own this store' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getStoreConversationMessages(
    @UserId() userId: string,
    @Param('storeId') storeId: string,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    const result = await this.messagesService.getConversationMessages(
      userId,
      conversationId,
      query,
      true,
      storeId,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Post('store/:storeId/reply')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a conversation as store owner' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({
    status: 201,
    description: 'Reply sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You do not own this store' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async replyAsStore(
    @UserId() userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: StoreReplyDto,
  ) {
    const message = await this.messagesService.replyAsStore(userId, storeId, dto);
    return {
      success: true,
      message,
    };
  }

  @Get('store/:storeId/unread-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread message count for store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You do not own this store' })
  async getStoreUnreadCount(
    @UserId() userId: string,
    @Param('storeId') storeId: string,
  ) {
    const count = await this.messagesService.getStoreUnreadCount(userId, storeId);
    return {
      success: true,
      count,
    };
  }
}
