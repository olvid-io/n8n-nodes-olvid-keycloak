import { OlvidKeycloakCredentials } from '../../../credentials/OlvidKeycloak.credentials';
import { KeycloakClient } from './KeycloakClient';

export class KeycloakClientSingleton {
	// We use a cache key (string) to store instances so multiple nodes with
	// the same credentials reuse the same client and token
	private static clientMap: {
		[cacheKey: string]: KeycloakClient;
	} = {};

	public static getInstance(credentials: OlvidKeycloakCredentials): KeycloakClient {
		// Create a unique identifier for the cache based on the connection context
		const cacheKey = `${credentials.keycloakUrl}_${credentials.adminRealmName}_${credentials.username}`;

		if (!this.clientMap[cacheKey]) {
			this.clientMap[cacheKey] = new KeycloakClient(credentials);
		}

		return this.clientMap[cacheKey];
	}
}
