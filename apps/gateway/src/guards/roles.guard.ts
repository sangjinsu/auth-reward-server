import {CanActivate, ExecutionContext, UnauthorizedException} from "@nestjs/common";

type UserRole = 'ADMIN' | 'USER' | 'OPERATOR' | 'AUDITOR';

export function RolesGuardFactory(allowedRoles: UserRole[]): CanActivate {
    return {
        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            if (!user || !user.role) {
                throw new UnauthorizedException('인증된 사용자가 아닙니다.');
            }

            if (!allowedRoles.includes(user.role)) {
                throw new UnauthorizedException('해당 역할로 접근할 수 없습니다.');
            }

            return true;
        },
    };
}