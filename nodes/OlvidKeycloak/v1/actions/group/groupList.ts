import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { realmNameParameter } from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const groupList: FtOperation = {
	resource: "group",

	options: {
		name: 'List Groups',
		value: 'groupList',
		action: 'List groups',
		description: 'List all groups',
	},

	parameters: [realmNameParameter.get()],

	handler: async (node: IExecuteFunctions, itemIndex: number, credentials: OlvidKeycloakCredentials): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;

		const groups = await client.groupList(realmNameValue);
		return { json: {groups: groups} };
	}
};
