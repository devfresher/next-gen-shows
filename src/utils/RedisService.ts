import { Redis, RedisOptions } from "ioredis"
import { config } from "./config"
import { SystemError } from "../errors"

class RedisService {
	private redis: Redis

	constructor(host: string, port: number) {        
		const redisConfig: RedisOptions = {
			host: host,
			port: port,
			maxRetriesPerRequest: null,
		}
		try {
			this.redis = new Redis(redisConfig)
		} catch (error) {
			throw new SystemError(500, "", error)
		}
	}

	async addToRevokedTokens(tokenIdentifier: string): Promise<number> {
		return await this.redis.sadd("revokedTokens", tokenIdentifier)
	}

	async isTokenRevoked(tokenIdentifier: string): Promise<boolean> {
		return (await this.redis.sismember("revokedTokens", tokenIdentifier)) === 1
	}
}

export default new RedisService(config.REDIS_HOST, config.REDIS_PORT)
