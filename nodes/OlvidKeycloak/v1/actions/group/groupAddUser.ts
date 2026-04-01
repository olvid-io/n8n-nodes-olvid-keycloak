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

export const groupAddUser: FtOperation = {
	resource: 'group',

	options: {
		name: 'Add User to a Group',
		value: 'groupAddUser',
		action: 'Add user to a group',
		description: 'Add user to group',
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

		await client.groupAddUsers(realmNameValue, groupIdValue, [userIdValue]);

		return { json: {} };
	},
};
