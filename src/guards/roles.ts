import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export const Roles = Reflector.createDecorator<string[]>();

interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    [key: string]: any;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    return this.matchRole(user, roles);
  }

  private matchRole(user, roles: string[]) {
    return roles.includes(
      (
        user as {
          role: string;
          [key: string]: any;
        }
      ).role,
    );
  }
}
