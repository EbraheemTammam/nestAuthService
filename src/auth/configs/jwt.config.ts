import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtConfig {
    private secret: string;

    constructor(private readonly configService: ConfigService) {
        this.secret = this.configService.get<string>('JWT_SECRET_KEY') as string;
    }

    get secretKey() { return this.secret; }
}