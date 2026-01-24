import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMessageDto,
  SendMessageDto,
  StoreReplyDto,
  GetConversationsQueryDto,
  GetMessagesQueryDto,
} from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Start a new conversation or get existing one between user and store
   */
  async getOrCreateConversation(userId: string, storeId: string) {
    // Check if store exists
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, userId: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Prevent store owner from messaging their own store
    if (store.userId === userId) {
      throw new BadRequestException('Cannot start conversation with your own store');
    }

    // Find or create conversation
    let conversation = await this.prisma.conversation.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            username: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          storeId,
          userId,
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              logo: true,
              username: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });
    }

    return conversation;
  }

  /**
   * Send message from user to store (initiate or continue conversation)
   */
  async sendMessageToStore(userId: string, dto: CreateMessageDto) {
    const conversation = await this.getOrCreateConversation(userId, dto.storeId);

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        senderType: 'USER',
        content: dto.content,
      },
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: dto.content,
        lastMessageAt: new Date(),
      },
    });

    return {
      conversation,
      message,
    };
  }

  /**
   * Send message in an existing conversation (for users)
   */
  async sendMessage(userId: string, dto: SendMessageDto) {
    // Verify conversation exists and user is part of it
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: userId,
        senderType: 'USER',
        content: dto.content,
      },
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        lastMessage: dto.content,
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  /**
   * Reply to a conversation as store owner
   */
  async replyAsStore(storeOwnerId: string, storeId: string, dto: StoreReplyDto) {
    // Verify store exists and user owns it
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        userId: storeOwnerId,
      },
    });

    if (!store) {
      throw new ForbiddenException('You do not own this store');
    }

    // Verify conversation exists and belongs to this store
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.storeId !== storeId) {
      throw new ForbiddenException('This conversation does not belong to your store');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: storeId,
        senderType: 'STORE',
        content: dto.content,
      },
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        lastMessage: dto.content,
        lastMessageAt: new Date(),
      },
    });

    // Mark all user messages in this conversation as read
    await this.prisma.message.updateMany({
      where: {
        conversationId: dto.conversationId,
        senderType: 'USER',
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return message;
  }

  /**
   * Get user's conversations (for users viewing their inbox)
   */
  async getUserConversations(userId: string, query: GetConversationsQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (search) {
      where.store = {
        name: {
          contains: search,
        },
      };
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              logo: true,
              username: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderType: 'STORE',
                  isRead: false,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    // Transform to include unread count
    const transformedConversations = conversations.map((conv) => ({
      ...conv,
      unreadCount: conv._count.messages,
      _count: undefined,
    }));

    return {
      conversations: transformedConversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get store's conversations (for store owners viewing their messages)
   */
  async getStoreConversations(storeOwnerId: string, storeId: string, query: GetConversationsQueryDto) {
    // Verify store ownership
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        userId: storeOwnerId,
      },
    });

    if (!store) {
      throw new ForbiddenException('You do not own this store');
    }

    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      storeId,
    };

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderType: 'USER',
                  isRead: false,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    // Filter by status if provided
    let filteredConversations = conversations;
    if (status === 'unread') {
      filteredConversations = conversations.filter((c) => c._count.messages > 0);
    } else if (status === 'read') {
      filteredConversations = conversations.filter((c) => c._count.messages === 0);
    }

    // Transform to include unread count
    const transformedConversations = filteredConversations.map((conv) => ({
      ...conv,
      unreadCount: conv._count.messages,
      _count: undefined,
    }));

    return {
      conversations: transformedConversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get messages in a conversation
   */
  async getConversationMessages(
    userId: string,
    conversationId: string,
    query: GetMessagesQueryDto,
    asStore: boolean = false,
    storeId?: string,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            username: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify access
    if (asStore) {
      if (!storeId || conversation.storeId !== storeId) {
        throw new ForbiddenException('You do not have access to this conversation');
      }
      // Verify store ownership
      if (conversation.store.userId !== userId) {
        throw new ForbiddenException('You do not own this store');
      }
    } else {
      if (conversation.userId !== userId) {
        throw new ForbiddenException('You do not have access to this conversation');
      }
    }

    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    // Mark messages as read based on who is viewing
    if (asStore) {
      // Store owner viewing - mark user messages as read
      await this.prisma.message.updateMany({
        where: {
          conversationId,
          senderType: 'USER',
          isRead: false,
        },
        data: { isRead: true },
      });
    } else {
      // User viewing - mark store messages as read
      await this.prisma.message.updateMany({
        where: {
          conversationId,
          senderType: 'STORE',
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return {
      conversation,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread message count for a store
   */
  async getStoreUnreadCount(storeOwnerId: string, storeId: string) {
    // Verify store ownership
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        userId: storeOwnerId,
      },
    });

    if (!store) {
      throw new ForbiddenException('You do not own this store');
    }

    const count = await this.prisma.message.count({
      where: {
        conversation: {
          storeId,
        },
        senderType: 'USER',
        isRead: false,
      },
    });

    return count;
  }

  /**
   * Get unread message count for a user
   */
  async getUserUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        conversation: {
          userId,
        },
        senderType: 'STORE',
        isRead: false,
      },
    });

    return count;
  }

  /**
   * Get conversation by ID with access check
   */
  async getConversationById(conversationId: string, userId: string, storeId?: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            username: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user has access (either as the user or as the store owner)
    const hasAccess =
      conversation.userId === userId ||
      conversation.store.userId === userId ||
      (storeId && conversation.storeId === storeId);

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    return conversation;
  }
}
