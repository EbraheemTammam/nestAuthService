import { ExecutionContext, Injectable } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY, 
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (isPublic) return true;
        return super.canActivate(context) as Promise<boolean>;
    }
}