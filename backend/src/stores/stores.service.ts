import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserStores(userId: string) {
    return this.prisma.store.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
