import {OlvidKeycloakCredentials} from "../../../credentials/OlvidKeycloak.credentials";
import { UserModel, GroupUserModel, IdentityDetails } from './types';
import {
	GenericResponse,
	ConfigurationQuery,
	CreateUserMagicLinkRequest,
	CreateUserMagicLinkResponse,
	RevokeUserMagicLinksRequest,
	CreateBotResponse,
	CreateBotRequest,
	GetUserByUserNameResponse,
	GetUserByUserNameRequest,
	GetUserGroupsRequest,
	GetUserGroupsResponse,
	ListGroupsRequest,
	ListGroupsResponse,
	GroupAddUsersRequest,
	GroupAddUsersResponse,
	GroupRemoveUsersResponse,
	GroupRemoveUsersRequest,
} from './configuration.types';
import { IDataObject } from 'n8n-workflow';

export class KeycloakClient {
	private credentials: OlvidKeycloakCredentials;
	private accessToken: string | null = null;

	constructor(credentials: OlvidKeycloakCredentials) {
		this.credentials = credentials;
	}

	/*
	 ** User Api
	 */
	public async getUserByUsername(realmName: string, username: string): Promise<UserModel> {
		const request: GetUserByUserNameRequest = {
			q: ConfigurationQuery.QUERY_GET_USER_BY_USERNAME,
			realmName: realmName,
			username: username,
			filters: [],
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<GetUserByUserNameResponse>).data;
	}

	public async createUserMagicLink(
		realmName: string,
		userId: string,
	): Promise<CreateUserMagicLinkResponse> {
		const request: CreateUserMagicLinkRequest = {
			q: ConfigurationQuery.QUERY_CREATE_USER_MAGIC_LINK,
			realmName: realmName,
			userId: userId,
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<CreateUserMagicLinkResponse>).data;
	}

	public async revokeUserMagicLinks(realmName: string, userId: string): Promise<void> {
		const request: RevokeUserMagicLinksRequest = {
			q: ConfigurationQuery.QUERY_REVOKE_USER_MAGIC_LINKS,
			realmName: realmName,
			userId: userId,
		};
		await this.configurationRequestWrapper(request);
	}

	/*
	 ** Bot Api
	 */
	public async createBot(
		realmName: string,
		username: string,
		identityDetails: IdentityDetails,
	): Promise<CreateBotResponse> {
		const request: CreateBotRequest = {
			q: ConfigurationQuery.QUERY_CREATE_BOT,
			realmName: realmName,
			username: username,
			firstname: identityDetails.firstname,
			lastname: identityDetails.lastname,
			position: identityDetails.position ?? '',
			company: identityDetails.company ?? '',
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<CreateBotResponse>).data;
	}

	/*
	 ** Group Api
	 */
	public async getUserGroups(realmName: string, userId: string): Promise<GroupUserModel[]> {
		const request: GetUserGroupsRequest = {
			q: ConfigurationQuery.QUERY_GET_USER_GROUPS,
			realmName: realmName,
			userId: userId,
			filters: [],
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<GetUserGroupsResponse>).data.data;
	}

	public async groupList(realmName: string, limit: number = 100): Promise<ListGroupsResponse> {
		const request: ListGroupsRequest = {
			q: ConfigurationQuery.QUERY_GET_GROUPS,
			realmName: realmName,
			userId: '',
			filters: [],
			isWithRestrictedInformations: true,
			limit: limit,
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<ListGroupsResponse>).data;
	}

	public async groupAddUsers(realmName: string, groupId: string, userIds: string[]): Promise<GroupAddUsersResponse> {
		const request: GroupAddUsersRequest = {
			q: ConfigurationQuery.QUERY_ADD_GROUP_USERS,
			realmName: realmName,
			id: groupId,
			dataArray: userIds
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<GroupAddUsersResponse>).data;
	}

	public async groupRemoveUsers(realmName: string, groupId: string, userIds: string[]): Promise<GroupRemoveUsersResponse> {
		const request: GroupRemoveUsersRequest = {
			q: ConfigurationQuery.QUERY_REMOVE_GROUP_USERS,
			realmName: realmName,
			id: groupId,
			dataArray: userIds
		};
		const response = await this.configurationRequestWrapper(request);
		return (response as GenericResponse<GroupRemoveUsersResponse>).data;
	}

	/*
	 ** Custom Api
	 */
	public async customRequest(payload_string: string): Promise<GenericResponse<IDataObject>> {
		const payload = JSON.parse(payload_string);
		return await this.configurationRequestWrapper(payload);
	}

	/*
	 ** Private methods
	 */
	private async getFreshToken(): Promise<string> {
		const baseUrl = this.credentials.keycloakUrl.replace(/\/$/, ''); // remove trailing /
		const tokenUrl = `${baseUrl}/realms/${this.credentials.adminRealmName}/protocol/openid-connect/token`;

		const payload = new URLSearchParams({
			grant_type: 'password',
			client_id: this.credentials.clientId,
			username: this.credentials.username,
			password: this.credentials.password,
		});

		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: payload.toString(),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to obtain Keycloak token: ${response.status} - ${errorText}`);
		}

		const data = (await response.json()) as { access_token: string };
		this.accessToken = data.access_token;

		return this.accessToken as string;
	}

	/**
	 * Generic wrapper for authenticated API requests.
	 * Handles standard HTTP errors and automatically refreshes an expired token (401).
	 * * @param endpointPath The path to append to the server URL (e.g., `/realms/olvid_admin/...`)
	 * @param payload Optional JSON payload for POST/PUT requests
	 * @param method HTTP Method (GET, POST, etc.)
	 */
	private async configurationRequestWrapper(
		payload?: object,
		method: string = 'POST',
	): Promise<GenericResponse<IDataObject>> {
		// Ensure we have an initial token
		if (!this.accessToken) {
			await this.getFreshToken();
		}

		const baseUrl = this.credentials.keycloakUrl.replace(/\/$/, '');
		const fullUrl = `${baseUrl}/realms/${this.credentials.adminRealmName}/olvid-rest/configuration`;

		// Create an inner function so we can easily retry it on a 401
		const makeApiCall = async (): Promise<GenericResponse<IDataObject>> => {
			const response = await fetch(fullUrl, {
				method,
				headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${this.accessToken}`,
				},
				body: payload ? JSON.stringify(payload) : '',
			});

			// If token is expired or invalid, throw a specific error to trigger a refresh
			if (response.status === 401) {
				throw new Error('UNAUTHORIZED');
			}

			// Attempt to parse JSON (fallback to empty object if response is empty)
			const jsonResponse = (await response
				.json()
				.catch(() => ({}))) as GenericResponse<IDataObject>;

			// Handle custom errors just like the Python implementation
			if (jsonResponse && typeof jsonResponse === 'object' && jsonResponse.error) {
				if (jsonResponse.error === 2) {
					throw new Error('UNAUTHORIZED');
				}
				const errorMessage = jsonResponse.message
					? `${jsonResponse.message} [code: ${jsonResponse.error}]`
					: String(jsonResponse.error);
				throw new Error(errorMessage);
			}

			if (!response.ok) {
				throw new Error(`API Request Failed: ${response.statusText}`);
			}

			return jsonResponse;
		};

		try {
			// Attempt the API call
			return await makeApiCall();
		} catch (error) {
			// If the call failed specifically due to authorization, refresh the token and retry ONCE
			if (error.message === 'UNAUTHORIZED') {
				await this.getFreshToken();
				return await makeApiCall();
			}

			// Re-throw any other errors (network issues, 403, 500, etc.)
			throw error;
		}
	}
}