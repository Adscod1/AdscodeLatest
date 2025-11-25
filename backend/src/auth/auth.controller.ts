import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { auth } from './auth.config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * Handle all Better-Auth routes
   * Better-Auth uses a catch-all handler for all authentication routes
   */
  @All('*')
  @ApiExcludeEndpoint() // Exclude from Swagger since Better-Auth has many dynamic routes
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Better-Auth handler expects the raw request object with additional properties
    const request = Object.assign(req, {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    
    return auth.handler(request as any);
  }
}
