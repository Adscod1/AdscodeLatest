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
  CreateInfluencerMessageDto,
  InfluencerReplyDto,
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

  // ============================================================================
  // INFLUENCER MESSAGING ENDPOINTS (for users messaging influencers)
  // ============================================================================

  @Post('influencer/send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to an influencer' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async sendMessageToInfluencer(
    @UserId() userId: string,
    @Body() dto: CreateInfluencerMessageDto,
  ) {
    const result = await this.messagesService.sendMessageToInfluencer(
      userId,
      dto.influencerId,
      dto.content,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get('influencer/start/:influencerId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get or create conversation with an influencer' })
  @ApiParam({ name: 'influencerId', description: 'Influencer ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved or created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getOrCreateInfluencerConversation(
    @UserId() userId: string,
    @Param('influencerId') influencerId: string,
  ) {
    const conversation = await this.messagesService.getOrCreateInfluencerConversation(
      userId,
      influencerId,
    );
    return {
      success: true,
      conversation,
    };
  }

  @Get('influencer/conversations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user influencer conversations' })
  @ApiResponse({
    status: 200,
    description: 'Influencer conversations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserInfluencerConversations(
    @UserId() userId: string,
    @Query() query: GetConversationsQueryDto,
  ) {
    const result = await this.messagesService.getUserInfluencerConversations(userId, query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('influencer/conversations/:conversationId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get influencer conversation messages' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation messages retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getInfluencerConversationMessages(
    @UserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    const result = await this.messagesService.getInfluencerConversationMessages(
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

  @Post('influencer/conversations/:conversationId/send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message in an influencer conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendInfluencerMessage(
    @UserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() body: { content: string },
  ) {
    const message = await this.messagesService.sendInfluencerMessage(
      userId,
      conversationId,
      body.content,
    );
    return {
      success: true,
      message,
    };
  }

  @Get('influencer/unread-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread influencer message count for user' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserInfluencerUnreadCount(@UserId() userId: string) {
    const count = await this.messagesService.getUserInfluencerUnreadCount(userId);
    return {
      success: true,
      count,
    };
  }

  // ============================================================================
  // INFLUENCER INBOX ENDPOINTS (for influencers viewing their messages)
  // ============================================================================

  @Get('influencer/inbox')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get influencer inbox (for influencers)' })
  @ApiResponse({
    status: 200,
    description: 'Inbox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not an influencer' })
  async getInfluencerInbox(
    @UserId() userId: string,
    @Query() query: GetConversationsQueryDto,
  ) {
    const result = await this.messagesService.getInfluencerConversations(userId, query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('influencer/inbox/:conversationId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inbox conversation messages (for influencers)' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation messages retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not an influencer' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getInfluencerInboxMessages(
    @UserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    const result = await this.messagesService.getInfluencerConversationMessages(
      userId,
      conversationId,
      query,
      true,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Post('influencer/inbox/reply')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a conversation as influencer' })
  @ApiResponse({
    status: 201,
    description: 'Reply sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not an influencer' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async replyAsInfluencer(
    @UserId() userId: string,
    @Body() dto: InfluencerReplyDto,
  ) {
    const message = await this.messagesService.replyAsInfluencer(
      userId,
      dto.conversationId,
      dto.content,
    );
    return {
      success: true,
      message,
    };
  }

  @Get('influencer/inbox/unread-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread message count for influencer inbox' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not an influencer' })
  async getInfluencerInboxUnreadCount(@UserId() userId: string) {
    const count = await this.messagesService.getInfluencerUnreadCount(userId);
    return {
      success: true,
      count,
    };
  }
}
