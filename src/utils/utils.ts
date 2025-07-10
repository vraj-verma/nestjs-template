import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Utility {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async encryptStr(plainStr: string, salt?: number) {
        try {
            const saltOrRounds = salt || 10;
            return await bcrypt.hash(plainStr, saltOrRounds);

        } catch (error) {
            console.error(`Failed to encrypt`, error.message);
            throw new Error(`Encryption failed: ${error.message}`)
        }
    }

    async decryptStr(plainStr: string, encryptStr: string) {
        try {
            return await bcrypt.compare(plainStr, encryptStr);
        } catch (error) {
            console.error(`Failed to decrypt`, error.message);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    async signJWT(payload: any) {
        try {
            return this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET') });
        } catch (error) {
            console.error(`Failed to sign JWT`, error.message);
            throw new Error(`Sign JWT failed: ${error.message}`);
        }
    }

    async verifyJWT(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            console.error(`Failed to verify JWT`, error.message);
            throw new Error(`Verify JWT failed: ${error.message}`);
        }
    }

}