import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndMerge<string[]>(
            'roles',
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRoles.includes(user?.role);
    }
}
