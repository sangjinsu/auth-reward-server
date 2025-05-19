import {Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config()
import {ConfigService} from "@nestjs/config";



@Injectable()
export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;
    private readonly refreshExpiresIn: string

    constructor() {
        const configService = new ConfigService();
        this.secret = configService.get<string>('JWT_SECRET')
        this.expiresIn = configService.get<string>('JWT_EXPIRES_IN')
        this.refreshExpiresIn = configService.get<string>('JWT_REFRESH_EXPIRES_IN')
    }

    sign(payload: object): string {
        const options: jwt.SignOptions = {
            expiresIn: this.parseExpiration(this.expiresIn),
        }
        return jwt.sign(payload, this.secret, options);
    }

    refresh(payload: object): string {
        const options: jwt.SignOptions = {
            expiresIn: this.parseExpiration(this.refreshExpiresIn),
        }
        return jwt.sign(payload, this.secret, options);
    }

    verify<T = any>(token: string): T {
        return jwt.verify(token, this.secret) as T;
    }

    decode(token: string): null | { [key: string]: any } {
        return jwt.decode(token) as { [key: string]: any } | null;
    }

    private parseExpiration(duration: string): number {
        const match = /^(\d+)([smhd])$/.exec(duration);
        if (!match) throw new Error(`Invalid JWT_EXPIRES_IN format: ${duration}`);

        const value = parseInt(match[1]);
        const unit = match[2];

        const multipliers = {
            s: 1,    // seconds
            m: 60,   // minutes
            h: 3600, // hours
            d: 86400 // days
        };

        return value * multipliers[unit] * 1000; // Convert to milliseconds
    }
}
