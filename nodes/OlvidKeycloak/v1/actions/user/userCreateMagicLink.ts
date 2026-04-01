import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	realmNameParameter,
	userIdParameter,
} from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from "../../../keycloak/KeycloakClientSingleton";
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const userCreateMagicLink: FtOperation = {
	resource: "user",

	options: {
		name: 'Create User Magic Link',
		value: 'userCreateMagicLink',
		action: 'Create user magic link',
		description: 'Create a magic link for a user',
	},

	parameters: [realmNameParameter.get(), userIdParameter.get()],

	handler: async (node: IExecuteFunctions, itemIndex: number, credentials: OlvidKeycloakCredentials): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const useridValue = node.getNodeParameter(userIdParameter.name, itemIndex) as string;

		const response = await client.createUserMagicLink(realmNameValue, useridValue);
		return { json: response };
	}
};
