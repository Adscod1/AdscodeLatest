import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get the current authenticated user from the request
 * Must be used with AuthGuard
 * 
 * @example
 * @Get('profile')
 * @UseGuards(AuthGuard)
 * getProfile(@CurrentUser() user: any) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Decorator to get the current user ID from the request
 * Must be used with AuthGuard
 * 
 * @example
 * @Get('my-data')
 * @UseGuards(AuthGuard)
 * getMyData(@UserId() userId: string) {
 *   return this.service.findByUserId(userId);
 * }
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Decorator to get the session from the request
 * Must be used with AuthGuard
 */
export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
