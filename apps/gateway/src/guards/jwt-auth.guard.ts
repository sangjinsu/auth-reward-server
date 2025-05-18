import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers.authorization;

        if (!auth || !auth.startsWith('Bearer ')) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }

        const token = auth.split(' ')[1];

        try {
            const res = await lastValueFrom(
                this.authClient.send('auth_validate', { token }),
            );

            if (!res?.valid) {
                throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            request.user = res.user;
            return true;
        } catch {
            throw new UnauthorizedException('토큰 검증 실패');
        }
    }
}
