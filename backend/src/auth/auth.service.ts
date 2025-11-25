import { Injectable } from '@nestjs/common';
import { auth } from './auth.config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  /**
   * Get the current session from the request
   */
  async getSession(request: Request) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers as any,
      });
      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get the current user from the request
   */
  async getCurrentUser(request: Request) {
    const session = await this.getSession(request);
    return session?.user || null;
  }

  /**
   * Check if the request has a valid session
   */
  async isAuthenticated(request: Request): Promise<boolean> {
    const session = await this.getSession(request);
    return !!session?.user;
  }

  /**
   * Get user ID from the request
   */
  async getUserId(request: Request): Promise<string | null> {
    const user = await this.getCurrentUser(request);
    return user?.id || null;
  }
}
