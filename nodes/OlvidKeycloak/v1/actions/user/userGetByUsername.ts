import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	realmNameParameter,
	usernameParameter,
} from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from "../../../keycloak/KeycloakClientSingleton";
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const userGetByUsername: FtOperation = {
	resource: 'user',

	options: {
		name: 'Get User By Username',
		value: 'userGetByUsername',
		action: 'Get user by username',
		description: 'Get user details by username',
	},

	parameters: [realmNameParameter.get(), usernameParameter.get()],

	handler: async (
		node: IExecuteFunctions,
		itemIndex: number,
		credentials: OlvidKeycloakCredentials,
	): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const usernamedValue = node.getNodeParameter(usernameParameter.name, itemIndex) as string;

		const response = await client.getUserByUsername(realmNameValue, usernamedValue);
		return { json: response };
	},
};
