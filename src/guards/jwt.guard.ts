
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Utility } from 'src/utils/utils';

@Injectable()
export class JWTAuthGuard implements CanActivate {

    constructor(
        private readonly utils: Utility,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {

            const payload = await this.utils.verifyJWT(token);

            request.user = payload;
        } catch (e) {
            throw new UnauthorizedException(e.message);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
