import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	identityDetailsParameter,
	realmNameParameter,
	usernameParameter,
} from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';
import { IdentityDetails } from '../../../keycloak/types';

export const botCreate: FtOperation = {
	resource: 'bot',

	options: {
		name: 'Create New Bot',
		value: 'botCreate',
		action: 'Create new bot',
		description: 'Create a new bot',
	},

	parameters: [realmNameParameter.get(), usernameParameter.get(), identityDetailsParameter.get()],

	handler: async (
		node: IExecuteFunctions,
		itemIndex: number,
		credentials: OlvidKeycloakCredentials,
	): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const realmNameValue = node.getNodeParameter(realmNameParameter.name, itemIndex) as string;
		const usernameValue = node.getNodeParameter(usernameParameter.name, itemIndex) as string;
		const identityDetailsValue = node.getNodeParameter(identityDetailsParameter.name, itemIndex) as IdentityDetails;

		const groups = await client.createBot(realmNameValue, usernameValue, identityDetailsValue);
		return { json: { groups: groups } };
	},
};
