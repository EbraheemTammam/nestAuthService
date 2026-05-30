import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({ url: 'redis://localhost:6379' });
        this.client.on('error', (err) => { console.error('Redis Error', err) });
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ) {
        if (ttlSeconds) {
            await this.client.set(
                key, value, { EX: ttlSeconds }
            );

            return;
        }

        await this.client.set(key, value);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }
}