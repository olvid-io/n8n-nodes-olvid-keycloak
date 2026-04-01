import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	groupIdParameter,
	realmNameParameter,
	userIdParameter,
} from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const groupRemoveUser: FtOperation = {
	resource: 'group',

	options: {
		name: 'Remove User From a Group',
		value: 'groupRemoveUser',
		action: 'Remove user from a group',
		description: 'Remvoe user from a group',
	},

	parameters: [realmNameParameter.get(), groupIdParameter.get(), userIdParameter.get()],

	handler: async (
		node: IExecuteFunctions,
		itemIndex: number,
		credentials: OlvidKeycloakCredentials,
	): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const groupIdValue = node.getNodeParameter(groupIdParameter.name, itemIndex) as string;
		const userIdValue = node.getNodeParameter(userIdParameter.name, itemIndex) as string;

		await client.groupRemoveUsers(realmNameValue, groupIdValue, [userIdValue]);

		return { json: {} };
	},
};
