import { Redis, RedisOptions } from 'ioredis';
import { config } from './config';
import { SystemError } from '../errors';

class RedisUtil {
	private redis: Redis;

	constructor(host: string, port: number, url: string) {
		try {
			if (host && port) {
				const redisConfig: RedisOptions = {
					host: host,
					port: port,
					maxRetriesPerRequest: null,
				};

				this.redis = new Redis(redisConfig);
			} else {
				this.redis = new Redis(url);
			}
		} catch (error) {
			throw new SystemError(500, '', error);
		}
	}

	async addToRevokedTokens(tokenIdentifier: string): Promise<number> {
		return await this.redis.sadd('revokedTokens', tokenIdentifier);
	}

	async isTokenRevoked(tokenIdentifier: string): Promise<boolean> {
		return (await this.redis.sismember('revokedTokens', tokenIdentifier)) === 1;
	}
}

export default new RedisUtil(config.REDIS_HOST, config.REDIS_PORT, config.REDIS_URL);
