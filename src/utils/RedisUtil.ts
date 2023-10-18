import { Redis } from 'ioredis';
import { config } from './config';

class RedisClient {
	private client: Redis;
	private host: string;
	private port: number;
	private url: string;

	constructor(host: string, port: number, url: string) {
		this.host = host;
		this.port = port;
		this.url = url;
		this.client = this.#getClient();
	}

	#getClient = () => {
		if (this.url) return new Redis(this.url);

		return new Redis({
			host: this.host,
			port: this.port,
			maxRetriesPerRequest: null,
		});
	};

	async addToRevokedTokens(tokenIdentifier: string): Promise<number> {
		return await this.client.sadd('revokedTokens', tokenIdentifier);
	}

	async isTokenRevoked(tokenIdentifier: string): Promise<boolean> {
		return (await this.client.sismember('revokedTokens', tokenIdentifier)) === 1;
	}
}

export default new RedisClient(config.REDIS_HOST, config.REDIS_PORT, config.REDIS_URL);
