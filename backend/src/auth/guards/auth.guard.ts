import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isAuthenticated = await this.authService.isAuthenticated(request);

    if (!isAuthenticated) {
      throw new UnauthorizedException('You must be logged in to access this resource');
    }

    // Attach user to request for easy access in controllers
    const user = await this.authService.getCurrentUser(request);
    (request as any).user = user;

    return true;
  }
}
