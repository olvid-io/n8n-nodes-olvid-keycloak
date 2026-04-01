import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { payloadParameter } from '../../parameters/basicParameters';
import { KeycloakClient } from '../../../keycloak/KeycloakClient';
import { KeycloakClientSingleton } from '../../../keycloak/KeycloakClientSingleton';
import { OlvidKeycloakCredentials } from '../../../../../credentials/OlvidKeycloak.credentials';
import { FtOperation } from '../../../operationsMap';

export const custom: FtOperation = {
	resource: 'custom',

	options: {
		name: 'Custom Request',
		value: 'custom',
		action: 'Custom Request',
		description: 'Perform custom api call',
	},

	parameters: [payloadParameter.get()],

	handler: async (
		node: IExecuteFunctions,
		itemIndex: number,
		credentials: OlvidKeycloakCredentials,
	): Promise<INodeExecutionData> => {
		const client: KeycloakClient = KeycloakClientSingleton.getInstance(credentials);

		const payload: string = node.getNodeParameter(payloadParameter.name, itemIndex) as string;

		const response: IDataObject = await client.customRequest(payload);
		return { json: response };
	},
};
