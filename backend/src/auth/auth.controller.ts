import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { auth } from './auth.config';
import { toNodeHandler } from 'better-auth/node';

// Create the Node.js handler for Better-Auth
const authHandler = toNodeHandler(auth);

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  /**
   * Handle all Better-Auth routes
   * Better-Auth uses a catch-all handler for all authentication routes
   */
  @All('*')
  @ApiExcludeEndpoint() // Exclude from Swagger since Better-Auth has many dynamic routes
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Use Better-Auth's Node.js handler
    return authHandler(req, res);
  }
}
