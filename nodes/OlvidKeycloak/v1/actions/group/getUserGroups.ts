import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { realmNameParameter, userIdParameter } from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const groupGetByUser: FtOperation = {
	resource: "group",

	options: {
		name: 'Get User Groups',
		value: 'groupGetByUser',
		action: 'Get user\'s groups',
		description: 'Retrieve groups a user is member of',
	},

	parameters: [realmNameParameter.get(), userIdParameter.get()],

	handler: async (node: IExecuteFunctions, itemIndex: number, credentials: OlvidKeycloakCredentials): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const userIdValue = node.getNodeParameter(userIdParameter.name, itemIndex) as string;

		const groups = await client.getUserGroups(realmNameValue, userIdValue);
		return { json: {groups: groups} };
	}
};
