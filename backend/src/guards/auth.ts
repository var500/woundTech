import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../common/index';
import { Request } from 'express';
import { ignorePath } from './ignorepaths';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const isFound = Object.entries(ignorePath).find(
      (each) =>
        each[0] === request.path &&
        each[1].methods.includes(request.method as any),
    );

    if (isFound) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.error('No token found in request headers');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstants.secret,
      });

      request.user = payload;

      const requiredRoles = this.reflector.get<string[]>(
        Roles,
        context.getHandler(),
      );

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const userRole = payload.role;

      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(`Role ${userRole} is not authorized`);
      }
    } catch (err) {
      if (err instanceof ForbiddenException) {
        throw err;
      }
      console.error(err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
